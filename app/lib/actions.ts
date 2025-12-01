'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import bcrypt from 'bcrypt';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function authenticate(
  prevState: string | null | undefined,
  formData: FormData,
) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  if (!email || !password) {
    return 'Missing credentials.';
  }

  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    const foundUser = user[0];
    if (!foundUser) return 'Invalid credentials.';
    const passwordsMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordsMatch) return 'Invalid credentials.';
    // At this point, credentials are valid — create a session or follow your app's auth flow.
    return null;
  } catch (err) {
    console.error(err);
    return 'Something went wrong.';
  }
}


export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// Shared schemas
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateInvoice = FormSchema.omit({ id: true, date: true });


// ------------------------------------------------------------
// UPDATE INVOICE
// ------------------------------------------------------------
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


// ------------------------------------------------------------
// DELETE INVOICE
// ------------------------------------------------------------
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error(error);
    
  }
}

export async function deleteInvoiceAction(formData: FormData) {
  const id = formData.get('id')?.toString();
  if (!id) return;
  try {
    await deleteInvoice(id);
    revalidatePath('/dashboard/invoices');
    // No return value for server action used on forms
    return;
  } catch (error) {
    console.error(error);
    return;
  }
}


// ------------------------------------------------------------
// CREATE INVOICE
// ------------------------------------------------------------
export async function createInvoice(
  prevState: State,
  formData: FormData
) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    return { message: 'Database Error: Failed to Create Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
