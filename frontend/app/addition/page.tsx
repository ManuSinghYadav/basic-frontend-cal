import { auth } from "@clerk/nextjs/server";
import AdditionCalculator from "./AdditionCalculator";

export default async function AdditionPage() {
  await auth.protect();

  return <AdditionCalculator />;
}