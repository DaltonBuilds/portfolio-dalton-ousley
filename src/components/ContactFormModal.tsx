"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    // Validate Turnstile token
    if (!turnstileToken) {
      toast.error("Please complete the security challenge")
      return
    }

    setIsSubmitting(true)

    try {
      // Submit lead to AWS Lambda via API Gateway
      const result = await submitLead({
        ...data,
        turnstileToken,
      })

      // Success! Show confirmation message
      toast.success("Message sent successfully!", {
        description: "Thanks for reaching out! I'll get back to you soon.",
      })

      // Log success for debugging (no PII)
      console.log("Lead submitted successfully:", { leadId: result.leadId })

      // Reset form and close modal
      reset()
      setTurnstileToken("")
      onOpenChange(false)
    } catch (error) {
      // Log error for debugging (no PII)
      console.error("Form submission error:", error)

      // Get user-friendly error message
      const errorMessage = getErrorMessage(error)
      
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

  // Simulate turnstile token for now (will be replaced with actual Turnstile in Task 4.1)
  React.useEffect(() => {
    if (open) {
      // Simulate getting a turnstile token
      setTurnstileToken("placeholder-turnstile-token")
    } else {
      // Reset form when modal closes
      reset()
      setTurnstileToken("")
    }
  }, [open, reset])

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                className="text-sm text-destructive"
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
                className="text-sm text-destructive"
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
                className="text-sm text-destructive"
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
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Turnstile Placeholder */}
          <div className="py-2">
            <div className="rounded-md border border-dashed border-slate-300 dark:border-slate-600 p-4 text-center text-sm text-slate-500 dark:text-slate-400">
              🔒 Cloudflare Turnstile will be added here in Task 4.1
            </div>
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
              disabled={isSubmitting}
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

