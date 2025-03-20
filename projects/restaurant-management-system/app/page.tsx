import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard on main page
  redirect("/dashboard")
}

