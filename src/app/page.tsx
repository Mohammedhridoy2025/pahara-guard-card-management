
"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toPng } from "html-to-image";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Printer, PlusCircle, Trash2, Download } from "lucide-react";

// Static QR code data as requested by the user
const STATIC_QR_CODE_DATA = `জরুরি প্রয়োজনে যোগাযোগ
কাউছার-01874227906
সাইদ-01831385524
সাব্বির-01830450327
সাইফুদ্দিন-01814296777`;

const singleFormSchema = z.object({
  name: z.string().min(1, "পুরো নাম আবশ্যক"),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  idNumber: z.string().min(1, "আইডি নম্বর আবশ্যক"),
  emergencyContacts: z.string().optional(),
  photoDataUri: z.string().optional(),
});
type SingleFormValues = z.infer<typeof singleFormSchema>;

const bulkGuardSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  idNumber: z.string().min(1, "আইডি নম্বর আবশ্যক"),
  photoDataUri: z.string().optional(),
});

const bulkFormSchema = z.object({
  guards: z.array(bulkGuardSchema).min(1, "অন্তত একটি কার্ড যোগ করুন"),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  emergencyContacts: z.string().optional(),
});
type BulkFormValues = z.infer<typeof bulkFormSchema>;

// Simplified CardData type
type CardData = {
  name: string;
  address: string;
  idNumber: string;
  emergencyContacts?: string;
  photoDataUri?: string | null;
  qrCodeData: string;
};

export default function Home() {
  const [singleCardData, setSingleCardData] = useState<CardData | null>(null);
  const [bulkCardsData, setBulkCardsData] = useState<CardData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const { toast } = useToast();
  const [isBulkTransitionPending, startBulkTransition] = useTransition();

  const singleCardRef = useRef<HTMLDivElement>(null);
  const bulkCardRefs = useRef<(HTMLDivElement | null)[]>([]);


  const singleForm = useForm<SingleFormValues>({
    resolver: zodResolver(singleFormSchema),
    defaultValues: {
      name: "মোঃ আল-আমিন",
      address: "কালিপুর, হোমনা, কুমিল্লা",
      idNumber: "০১",
      emergencyContacts: `কাউছার-01874227906
সাইদ-01831385524
সাব্বির-01830450327
সাইফুদ্দিন-01814296777`,
      photoDataUri: undefined,
    },
    mode: "onChange",
  });

  const bulkForm = useForm<BulkFormValues>({
    resolver: zodResolver(bulkFormSchema),
    defaultValues: {
      guards: [{ name: "", idNumber: "", photoDataUri: "" }],
      address: "কালিপুর, হোমনা, কুমিল্লা",
      emergencyContacts: `কাউছার-01874227906
সাইদ-01831385524
সাব্বির-01830450327
সাইফুদ্দিন-01814296777`,
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: bulkForm.control,
    name: "guards",
  });

  const handleUpdateSingleCard = (values: SingleFormValues) => {
    setIsSubmitting(true);
    const newCardData: CardData = { ...values, qrCodeData: STATIC_QR_CODE_DATA };
    setSingleCardData(newCardData);
    toast({
      title: "সফল!",
      description: "কার্ড সফলভাবে আপডেট হয়েছে!",
    });
    setIsSubmitting(false);
  };
  
  const handlePrintSingle = () => {
    setIsPrinting(true);
    setBulkCardsData([]); // Ensure bulk data is cleared for single print
    const values = singleForm.getValues();
    const newCardData: CardData = { ...values, qrCodeData: STATIC_QR_CODE_DATA };
    setSingleCardData(newCardData);
    
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const handleDownload = useCallback(async (cardRef: React.RefObject<HTMLDivElement>, cardName: string) => {
    if (!cardRef.current) {
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "কার্ড প্রিভিউ পাওয়া যায়নি।",
      });
      return;
    }

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1.0,
        skipAutoScale: true,
        filter: (node) => {
           if (
            node.tagName === 'LINK' &&
            (node as HTMLLinkElement).href.includes('fonts.googleapis.com')
          ) {
            return false;
          }
          return true;
        },
      });
      const link = document.createElement("a");
      link.download = `${cardName.replace(/\s+/g, '_').toLowerCase()}_card.png`;
      link.href = dataUrl;
      link.click();
      toast({
        title: "সফল!",
        description: "কার্ড সফলভাবে ডাউনলোড হয়েছে।",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "কার্ড ডাউনলোড করতে ব্যর্থ হয়েছে।",
      });
    }
  }, [toast]);


  const handleGenerateBulkCards = (values: BulkFormValues) => {
    setIsSubmitting(true);
    const generatedCards = values.guards.map((guard) => {
      const input = {
        ...guard,
        address: values.address,
        emergencyContacts: values.emergencyContacts,
      };
      return { ...input, qrCodeData: STATIC_QR_CODE_DATA };
    });

    startBulkTransition(() => {
      setBulkCardsData(generatedCards);
      bulkCardRefs.current = generatedCards.map(() => null);
    });
    
    toast({
      title: "সফল!",
      description: `${generatedCards.length}টি কার্ড সফলভাবে তৈরি হয়েছে।`,
    });
    setIsSubmitting(false);
  };
  
  const handlePrintBulk = () => {
    setIsPrinting(true);
    handleGenerateBulkCards(bulkForm.getValues());
    // A short delay to allow all cards to render
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handlePhotoUpload = (
    index: number,
    dataUri: string | null
  ) => {
    bulkForm.setValue(`guards.${index}.photoDataUri`, dataUri || undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
    <main className="container mx-auto px-4 py-8 md:py-12 no-print">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight text-shadow">
          সিকিউরিটি গার্ড কার্ড জেনারেটর
        </h1>
        <p className="mt-2 text-lg text-white/80">
          ব্যক্তির তথ্য দিন এবং কার্ড তৈরি করুন
        </p>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="single">একক কার্ড</TabsTrigger>
          <TabsTrigger value="bulk">বাল্ক জেনারেট</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-12 mt-6">
            <div className="w-full lg:w-2/5 xl:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>ব্যক্তির তথ্য</CardTitle>
                  <CardDescription>
                    কার্ড তৈরি করতে নিচের ফর্মটি পূরণ করুন।
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...singleForm}>
                    <form
                      onSubmit={singleForm.handleSubmit(handleUpdateSingleCard)}
                      className="space-y-4"
                    >
                      <FormField
                        control={singleForm.control}
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
                        control={singleForm.control}
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
                        control={singleForm.control}
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
                        control={singleForm.control}
                        name="photoDataUri"
                        render={() => (
                          <FormItem>
                            <FormLabel>ছবি আপলোড করুন</FormLabel>
                            <FormControl>
                              <PhotoUploader onPhotoUpload={(dataUri) => singleForm.setValue("photoDataUri", dataUri || undefined)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={singleForm.control}
                        name="emergencyContacts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>জরুরি প্রয়োজনে যোগাযোগ</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="নাম এবং মোবাইল নম্বর লিখুন"
                                {...field}
                                rows={4}
                              />
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
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isSubmitting ? "আপডেট হচ্ছে..." : "কার্ড আপডেট করুন"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col items-center gap-6">
              <div className="w-full max-w-lg">
                 <GuardCardPreview ref={singleCardRef} {...(singleCardData || { ...singleForm.getValues(), qrCodeData: STATIC_QR_CODE_DATA })} />
              </div>
              <div className="w-full max-w-md grid grid-cols-2 gap-4">
                 <Button onClick={() => handleDownload(singleCardRef, singleForm.getValues("name"))} className="w-full" size="lg">
                    <Download className="mr-2 h-5 w-5"/>
                    ডাউনলোড
                 </Button>
                <Button onClick={handlePrintSingle} disabled={isPrinting} className="w-full" size="lg">
                  {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-5 w-5" />}
                  প্রিন্ট করুন
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="bulk">
          <div className="flex flex-col xl:flex-row items-start gap-8 mt-6">
             <div className="w-full xl:w-1/2">
                <Card>
                   <CardHeader>
                      <CardTitle>বাল্ক কার্ড তৈরি</CardTitle>
                      <CardDescription>
                         সাধারণ তথ্য এবং একাধিক গার্ডের তালিকা যোগ করুন।
                      </CardDescription>
                   </CardHeader>
                   <CardContent>
                      <Form {...bulkForm}>
                         <form onSubmit={bulkForm.handleSubmit(handleGenerateBulkCards)} className="space-y-6">
                            <div className="space-y-4">
                               <FormField
                                  control={bulkForm.control}
                                  name="address"
                                  render={({ field }) => (
                                     <FormItem>
                                        <FormLabel>সাধারণ ঠিকানা</FormLabel>
                                        <FormControl>
                                           <Input placeholder="সকল কার্ডের জন্য ঠিকানা" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                     </FormItem>
                                  )}
                               />
                               <FormField
                                  control={bulkForm.control}
                                  name="emergencyContacts"
                                  render={({ field }) => (
                                     <FormItem>
                                        <FormLabel>সাধারণ জরুরি যোগাযোগ</FormLabel>
                                        <FormControl>
                                           <Textarea placeholder="সকল কার্ডের জন্য নম্বর" {...field} rows={4}/>
                                        </FormControl>
                                        <FormMessage />
                                     </FormItem>
                                  )}
                               />
                            </div>
                            
                            <div className="space-y-4">
                              {fields.map((field, index) => (
                                <Card key={field.id} className="p-4 relative">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-4">
                                        <FormField
                                          control={bulkForm.control}
                                          name={`guards.${index}.name`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>গার্ডের নাম</FormLabel>
                                              <FormControl>
                                                <Input placeholder={`গার্ড ${index + 1} এর নাম`} {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={bulkForm.control}
                                          name={`guards.${index}.idNumber`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>আইডি নম্বর</FormLabel>
                                              <FormControl>
                                                <Input placeholder={`গার্ড ${index + 1} এর আইডি`} {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <FormField
                                        control={bulkForm.control}
                                        name={`guards.${index}.photoDataUri`}
                                        render={() => (
                                          <FormItem>
                                            <FormLabel>ছবি</FormLabel>
                                            <FormControl>
                                               <PhotoUploader onPhotoUpload={(dataUri) => handlePhotoUpload(index, dataUri)} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={() => remove(index)}
                                    disabled={fields.length <= 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </Card>
                              ))}
                            </div>

                            <Button type="button" variant="outline" onClick={() => append({ name: "", idNumber: "", photoDataUri: "" })}>
                               <PlusCircle className="mr-2"/>
                               নতুন গার্ড যোগ করুন
                            </Button>

                            <Button type="submit" disabled={isSubmitting || isBulkTransitionPending} className="w-full !mt-8">
                               {isSubmitting || isBulkTransitionPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                               {isSubmitting || isBulkTransitionPending ? 'জেনারেট হচ্ছে...' : 'কার্ডগুলো জেনারেট করুন'}
                            </Button>
                         </form>
                      </Form>
                   </CardContent>
                </Card>
             </div>
             <div className="w-full xl:w-1/2 flex flex-col items-center gap-6">
                 <h2 className="text-2xl font-bold text-white">কার্ড প্রিভিউ</h2>
                 <div className="w-full p-4 bg-gray-900/20 rounded-lg max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                       { (isBulkTransitionPending) ? 
                          Array.from({ length: bulkForm.getValues('guards').length }).map((_, i) => (
                            <div key={i} className="max-w-lg mx-auto w-full">
                                <div className="w-full aspect-[85.6/54] bg-gray-500/50 rounded-xl animate-pulse"></div>
                            </div>
                          ))
                         : bulkCardsData.length > 0 ? (
                           bulkCardsData.map((card, index) => (
                            <div key={index} className="max-w-lg mx-auto w-full">
                              <div className="space-y-2">
                                <GuardCardPreview ref={(el) => (bulkCardRefs.current[index] = el)} {...card} />
                                <Button
                                  onClick={() => handleDownload({ current: bulkCardRefs.current[index] }, card.name)}
                                  className="w-full"
                                  variant="secondary"
                                >
                                  <Download className="mr-2 h-5 w-5" />
                                  ডাউনলোড
                                </Button>
                              </div>
                            </div>
                           ))
                        ) : (
                           <p className="text-white/70 text-center col-span-full py-10">
                              প্রিভিউ দেখতে কার্ড জেনারেট করুন।
                           </p>
                        )}
                    </div>
                 </div>
                 <div className="w-full max-w-md">
                   <Button onClick={handlePrintBulk} disabled={isPrinting || bulkCardsData.length === 0} className="w-full" size="lg">
                      {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-5 w-5" />}
                      সবগুলো প্রিন্ট করুন
                   </Button>
                 </div>
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
    <div className="print-only">
        {bulkCardsData.length > 0 ? (
            <div className="bulk-print-container">
                {bulkCardsData.map((card, index) => (
                    <div key={`print-${index}`} className="print-card-wrapper">
                        <GuardCardPreview {...card} />
                    </div>
                ))}
            </div>
        ) : (
             <div className="single-card-print-container">
                 <GuardCardPreview {...(singleCardData || { ...singleForm.getValues(), qrCodeData: STATIC_QR_CODE_DATA })} />
             </div>
        )}
    </div>
    </>
  );
}
