"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateQrCode } from "@/ai/flows/generate-qr-code-flow";
import { useToast } from "@/hooks/use-toast";

import { GuardCardPreview } from "@/components/guard-card-preview";
import { PhotoUploader } from "@/components/photo-uploader";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Printer } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "পুরো নাম আবশ্যক").default("কালিপুর গ্রামঃ পাহাড়াদার"),
  address: z
    .string()
    .min(1, "ঠিকানা আবশ্যক")
    .default("কালিপুর, হোমনা, কুমিল্লা"),
  idNumber: z.string().min(1, "আইডি নম্বর আবশ্যক").default("SG-2023-7865"),
  validity: z
    .string()
    .min(1, "কার্ড বৈধতা আবশ্যক")
    .default("০১/০১/২০২৩ - ৩১/১২/২০২৪"),
  emergencyContacts: z.string().optional().default("সাকিব 01866642992\nসাইদ 01831385524\nনয়ন 01603077790"),
  photoDataUri: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({}),
    mode: "onChange",
  });

  const watchedValues = form.watch();

  const handleUpdateCard = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await generateQrCode(values);
      setQrCodeData(result.qrCodeData);
      toast({
        title: "সফল!",
        description: "কার্ড সফলভাবে আপডেট হয়েছে!",
      });
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "QR কোড তৈরি করতে ব্যর্থ হয়েছে।",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    // Generate QR code with latest data before printing
    handleUpdateCard(form.getValues()).then(() => {
      // Small delay to ensure QR code is rendered
      setTimeout(() => {
         window.print();
      }, 300)
    });
  };

  const handlePhotoUpload = (dataUri: string | null) => {
    form.setValue("photoDataUri", dataUri || undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 no-print">
        <h1 className="text-4xl font-bold text-white tracking-tight text-shadow">
          সিকিউরিটি গার্ড কার্ড জেনারেটর
        </h1>
        <p className="mt-2 text-lg text-white/80">
          ব্যক্তির তথ্য দিন এবং কার্ড তৈরি করুন
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-12">
        <div className="w-full lg:w-2/5 xl:w-1/3 no-print">
          <Card>
            <CardHeader>
              <CardTitle>ব্যক্তির তথ্য</CardTitle>
              <CardDescription>
                কার্ড তৈরি করতে নিচের ফর্মটি পূরণ করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdateCard)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পুরো নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পুরো নাম লিখুন" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ঠিকানা</FormLabel>
                        <FormControl>
                          <Input placeholder="ঠিকানা লিখুন" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>আইডি নম্বর</FormLabel>
                        <FormControl>
                          <Input placeholder="আইডি নম্বর লিখুন" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>কার্ড বৈধতা</FormLabel>
                        <FormControl>
                          <Input placeholder="DD/MM/YYYY - DD/MM/YYYY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="emergencyContacts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>জরুরি প্রয়োজনে যোগাযোগ</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="নাম এবং মোবাইল নম্বর লিখুন"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="photoDataUri"
                    render={() => (
                      <FormItem>
                        <FormLabel>ছবি আপলোড করুন</FormLabel>
                        <FormControl>
                          <PhotoUploader onPhotoUpload={handlePhotoUpload} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full !mt-6"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "আপডেট হচ্ছে..." : "কার্ড আপডেট করুন"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col items-center gap-6">
          <div className="w-full max-w-lg printable-area">
            <GuardCardPreview {...watchedValues} qrCodeData={qrCodeData} />
          </div>
          <div className="w-full max-w-md no-print">
            <Button onClick={handlePrint} className="w-full" size="lg">
              <Printer className="mr-2 h-5 w-5" />
              প্রিন্ট করুন
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
