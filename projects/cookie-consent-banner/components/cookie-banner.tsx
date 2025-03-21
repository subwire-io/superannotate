"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (cookieConsent === null) {
      // Add a small delay for a smoother appearance
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setIsVisible(false)

    toast({
      title: "Cookies accepted",
      description: "Your cookie preferences have been saved.",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={undoCookieChoice}
          className="transition-all duration-200 hover:scale-105"
        >
          Undo
        </Button>
      ),
    })
  }

  const declineCookies = () => {
    setShowDeclineDialog(true)
  }

  const confirmDeclineCookies = () => {
    localStorage.setItem("cookieConsent", "declined")
    setIsVisible(false)
    setShowDeclineDialog(false)

    toast({
      title: "Cookies declined",
      description: "Your cookie preferences have been saved.",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={undoCookieChoice}
          className="transition-all duration-200 hover:scale-105"
        >
          Undo
        </Button>
      ),
    })
  }

  const dismissBanner = () => {
    // Just hide the banner without setting a preference
    setIsVisible(false)

    toast({
      title: "Banner dismissed",
      description: "You can update your cookie preferences in settings.",
    })
  }

  const undoCookieChoice = () => {
    localStorage.removeItem("cookieConsent")
    setIsVisible(true)

    toast({
      title: "Preference reset",
      description: "Your cookie preference has been reset.",
    })
  }

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto p-4">
          <div className="flex justify-end mb-1">
            <button
              onClick={dismissBanner}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Close cookie banner"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
                traffic. By clicking "Accept", you consent to our use of cookies.
                <Link
                  href="/cookie-policy"
                  className="ml-1 text-primary underline hover:text-primary/80 transition-colors duration-200 hover:underline-offset-4"
                >
                  Learn more
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={declineCookies}
                aria-label="Decline cookies"
                className="transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={acceptCookies}
                aria-label="Accept cookies"
                className="transition-all duration-200 hover:scale-105"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline cookies?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disable all non-essential cookies. Some features of the website may not function properly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeclineCookies}>Decline</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

