import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const apartmentSchema = z.object({
  floor: z.coerce.number().min(0, "Floor must be 0 or higher"),
});

type ApartmentFormValues = z.infer<typeof apartmentSchema>;

function Test() {
  const form = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentSchema) as any,
  });

  const onSubmit: SubmitHandler<ApartmentFormValues> = (data) => {
    console.log(data.floor);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)} />;
}
