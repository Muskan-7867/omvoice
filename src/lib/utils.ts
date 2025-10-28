import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {  readTextFile, writeTextFile, BaseDirectory, mkdir, exists } from "@tauri-apps/plugin-fs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



//   const INVOICE_FILE = "invoice_counter.txt";



//  export async function getNextInvoiceId(): Promise<string> {
//   try {
//     // Ensure app data directory exists
//     const appDirExists = await exists("", { baseDir: BaseDirectory.AppData });
//     if (!appDirExists) {
//       await mkdir("", { baseDir: BaseDirectory.AppData, recursive: true });
//     }

//     // Check if the counter file exists
//     const fileExists = await exists(INVOICE_FILE, { baseDir: BaseDirectory.AppData });
//     let newNumber = 1;

//     if (fileExists) {
//       const data = await readTextFile(INVOICE_FILE, { baseDir: BaseDirectory.AppData });
//       const lastNumber = parseInt(data.trim(), 10) || 0;
//       newNumber = lastNumber + 1;
//     }

//     // Save new count
//     await writeTextFile(INVOICE_FILE, newNumber.toString(), { baseDir: BaseDirectory.AppData });

//     // Return formatted invoice ID
//     return `INV-${String(newNumber).padStart(5, "0")}`;
//   } catch (err) {
//     console.error("Error handling invoice counter:", err);
//     return "INV-00001";
//   }
// }

// export async function refreshInvoiceCounter(): Promise<string> {
//   const id = await getNextInvoiceId();
//   return id;
// }

const INVOICE_FILE = "invoice_counter.txt";

export async function ensureAppDir() {
  const appDirExists = await exists("", { baseDir: BaseDirectory.AppData });
  if (!appDirExists) {
    await mkdir("", { baseDir: BaseDirectory.AppData, recursive: true });
  }
}

// ✅ Only read current invoice number (don’t increment)
export async function getCurrentInvoiceId(): Promise<string> {
  try {
    await ensureAppDir();

    const fileExists = await exists(INVOICE_FILE, { baseDir: BaseDirectory.AppData });
    let number = 1;

    if (fileExists) {
      const data = await readTextFile(INVOICE_FILE, { baseDir: BaseDirectory.AppData });
      number = parseInt(data.trim(), 10) || 1;
    } else {
      await writeTextFile(INVOICE_FILE, "1", { baseDir: BaseDirectory.AppData });
    }

    return `INV-${String(number).padStart(5, "0")}`;
  } catch (err) {
    console.error("Error reading invoice counter:", err);
    return "INV-00001";
  }
}

// ✅ Increment invoice number and return new ID
export async function incrementInvoiceId(): Promise<string> {
  try {
    await ensureAppDir();

    const fileExists = await exists(INVOICE_FILE, { baseDir: BaseDirectory.AppData });
    let newNumber = 1;

    if (fileExists) {
      const data = await readTextFile(INVOICE_FILE, { baseDir: BaseDirectory.AppData });
      const lastNumber = parseInt(data.trim(), 10) || 0;
      newNumber = lastNumber + 1;
    }

    await writeTextFile(INVOICE_FILE, newNumber.toString(), { baseDir: BaseDirectory.AppData });
    return `INV-${String(newNumber).padStart(5, "0")}`;
  } catch (err) {
    console.error("Error incrementing invoice ID:", err);
    return "INV-00001";
  }
}