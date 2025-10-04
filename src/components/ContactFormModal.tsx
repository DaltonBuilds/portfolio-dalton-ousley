"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { leadFormSchema, type LeadFormData } from "@/lib/validations/lead-form"
import { submitLead, getErrorMessage, isLeadSubmissionError } from "@/lib/api/lead-client"

interface ContactFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactFormModal({ open, onOpenChange }: ContactFormModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [turnstileToken, setTurnstileToken] = React.useState<string>("")
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      turnstileToken: "",
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    console.log("🚀 Form submission started")
    console.log("📝 Form data:", { ...data, message: data.message.substring(0, 20) + "..." })
    console.log("🔐 Turnstile token present:", !!turnstileToken)
    
    // Validate Turnstile token
    if (!turnstileToken) {
      console.error("❌ Turnstile token missing")
      toast.error("Please complete the security challenge")
      return
    }

    console.log("✅ Starting submission to API...")
    setIsSubmitting(true)

    try {
      // Submit lead to AWS Lambda via API Gateway
      const result = await submitLead({
        ...data,
        turnstileToken,
      })
      
      console.log("✅ Submission successful!", result)

      // Success! Show confirmation message
      toast.success("Message sent successfully!", {
        description: "Thanks for reaching out! I'll get back to you soon.",
      })

      // Log success for debugging (no PII)
      console.log("Lead submitted successfully:", { leadId: result.leadId })

      // Reset form and close modal
      reset()
      setTurnstileToken("")
      turnstileRef.current?.reset()
      onOpenChange(false)
    } catch (error) {
      // Log error for debugging (no PII)
      console.error("Form submission error:", error)

      // Get user-friendly error message
      const errorMessage = getErrorMessage(error)
      
      // Reset Turnstile on error (user needs to complete challenge again)
      turnstileRef.current?.reset()
      setTurnstileToken("")
      
      // Show specific error message if available
      if (isLeadSubmissionError(error)) {
        // Handle specific error codes
        if (error.code === "CONFIG_ERROR") {
          toast.error("Configuration Error", {
            description: "The contact form is not properly configured. Please try again later or contact me directly.",
          })
        } else if (error.code === "TIMEOUT_ERROR") {
          toast.error("Request Timeout", {
            description: "The request took too long. Please check your connection and try again.",
          })
        } else if (error.statusCode === 429) {
          toast.error("Too Many Requests", {
            description: "Please wait a moment before trying again.",
          })
        } else {
          toast.error("Failed to send message", {
            description: errorMessage,
          })
        }
      } else {
        // Generic error fallback
        toast.error("Failed to send message", {
          description: "Please try again or contact me directly via email.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      reset()
      setTurnstileToken("")
      setValue("turnstileToken", "")
      turnstileRef.current?.reset()
    }
  }, [open, reset, setValue])

  // Handle Turnstile success
  const handleTurnstileSuccess = (token: string) => {
    console.log("✅ Turnstile challenge completed successfully")
    console.log("🔑 Token length:", token.length)
    setTurnstileToken(token)
    // IMPORTANT: Also update the form field value for validation
    setValue("turnstileToken", token, { shouldValidate: true })
  }

  // Handle Turnstile error
  const handleTurnstileError = () => {
    console.error("❌ Turnstile challenge failed")
    setTurnstileToken("")
    setValue("turnstileToken", "", { shouldValidate: true })
    toast.error("Security challenge failed", {
      description: "Please try again or refresh the page.",
    })
  }

  // Handle Turnstile expiration
  const handleTurnstileExpire = () => {
    console.warn("⚠️ Turnstile token expired")
    setTurnstileToken("")
    setValue("turnstileToken", "", { shouldValidate: true })
  }

  // Get Turnstile site key from environment
  const turnsiteSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Check if Turnstile is configured
  if (!turnsiteSiteKey) {
    console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured")
  }

  // Debug: Log button state
  React.useEffect(() => {
    console.log("🎯 Submit button state:", {
      isSubmitting,
      hasTurnstileToken: !!turnstileToken,
      tokenLength: turnstileToken?.length || 0,
      buttonDisabled: isSubmitting || !turnstileToken
    })
  }, [isSubmitting, turnstileToken])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            Let&apos;s Build Together
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Have a project in mind? I&apos;d love to hear about it. Fill out the form below and I&apos;ll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form 
          onSubmit={(e) => {
            console.log("📋 Form submit event triggered")
            handleSubmit(onSubmit)(e)
          }} 
          className="space-y-4 mt-4"
        >
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p
                id="name-error"
                className="text-sm text-red-600 dark:text-red-400 font-medium"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-sm text-red-600 dark:text-red-400 font-medium"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Company Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-700 dark:text-slate-300">
              Company <span className="text-slate-500 dark:text-slate-400 text-xs">(optional)</span>
            </Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              {...register("company")}
              aria-invalid={errors.company ? "true" : "false"}
              aria-describedby={errors.company ? "company-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.company && (
              <p
                id="company-error"
                className="text-sm text-red-600 dark:text-red-400 font-medium"
                role="alert"
              >
                {errors.company.message}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell me about your project..."
              className="min-h-[120px] resize-none"
              {...register("message")}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p
                id="message-error"
                className="text-sm text-red-600 dark:text-red-400 font-medium"
                role="alert"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Cloudflare Turnstile */}
          <div className="py-2">
            <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
              Security Check <span className="text-destructive">*</span>
            </Label>
            {turnsiteSiteKey ? (
              <Turnstile
                ref={turnstileRef}
                siteKey={turnsiteSiteKey}
                onSuccess={handleTurnstileSuccess}
                onError={handleTurnstileError}
                onExpire={handleTurnstileExpire}
                options={{
                  theme: "auto",
                  size: "normal",
                }}
              />
            ) : (
              <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                ⚠️ Turnstile is not configured. Please set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment variables.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

