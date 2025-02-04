"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { handleSubmit } from "@/lib/send-email"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export const formSchema = z.object({
  subject: z
    .string()
    .min(2, {
      message: "Subject must be at least 2 characters",
    })
    .max(60, {
      message: "Subject must be at most 60 characters",
    }),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(60, {
      message: "Name must be at most 60 characters",
    }),
  email: z.string().email().max(80, {
    message: "Email must be at most 80 characters",
  }),
  message: z
    .string()
    .min(10, {
      message: "Message must be at least 10 characters",
    })
    .max(1000, {
      message: "Message must be at most 1000 characters",
    }),
  meet: z
    .string()
    .min(10, {
      message: "Message must be at least 10 characters",
    })
    .max(1000, {
      message: "Message must be at most 1000 characters",
    })
    .optional(),
})

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          setLoading(true)
          setError(null) // Reset error before submitting

          try {
            const response = await handleSubmit(data)

            if (response?.error) {
              setError(response.error) // Set error if submission fails
            }
          } finally {
            setLoading(false)
          }
        })}
        method="POST"
        className="space-y-8 mt-8"
      >
        {error && (
          <div className="bg-red-500 text-white p-2 rounded">{error}</div>
        )}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject*</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="I want to contribute in the API"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormDescription>Why are you contacting us?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="Max Verstappen"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormDescription>Your name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  required
                  placeholder="youremail@example.com"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormDescription>Your email to contact you</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message*</FormLabel>
              <FormControl>
                <Textarea
                  required
                  placeholder="I love F1 Api"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell us what you think about the API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How you know us</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Searching in google..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell us how you know about our API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              Sending
            </span>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </Form>
  )
}
