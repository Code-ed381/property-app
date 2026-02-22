import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const apartmentSchema = z.object({
  floor: z.coerce.number().min(0, "Floor must be 0 or higher"),
});

type FormInput = z.input<typeof apartmentSchema>;
type FormOutput = z.output<typeof apartmentSchema>;

function Test() {
  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(apartmentSchema),
  });

  const onSubmit: SubmitHandler<FormOutput> = (data) => {
    console.log(data.floor);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)} />;
}
