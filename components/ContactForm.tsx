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
})

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleSubmit({ ...data }))}
        method="POST"
        className="space-y-8 mt-8"
      >
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="I want to contribute in the API"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your subject</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="Max Verstappen"
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  required
                  placeholder="youremail@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea required placeholder="I love F1 Api" {...field} />
              </FormControl>
              <FormDescription>
                Tell us what you think about the API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
  )
}
