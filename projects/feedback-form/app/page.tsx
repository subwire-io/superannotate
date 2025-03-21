import FeedbackForm from "@/components/feedback-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">We Value Your Feedback</h1>
        <FeedbackForm />
      </div>
    </main>
  )
}

