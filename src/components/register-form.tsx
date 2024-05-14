"use client";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Key, Mail, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {signIn} from "next-auth/react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const formSchema = z.object({
    username: z.string().min(5, {
        message: "Имя пользователя должно состоять хотя бы из 5 символов"
    }),
    email: z.string().email({
        message: "Введите корректную почту"
    }),
    password: z.string().min(10, {
        message: "Минимальная длина пароля 10 символов"
    }),
});

const RegisterForm: React.FC = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await signIn("register", {...values, redirect: false});
        if (res?.error) {
            toast.error(res.error);
            return
        }

        toast.success("Успешная регистрация")
        router.push("/calendar");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
                <FormField control={form.control} render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input startIcon={UserRound} placeholder="Имя пользователя" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} name="username"/>
                <FormField control={form.control} render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input startIcon={Mail} placeholder="Электронная почта"
                                   type="email" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} name="email"/>
                <FormField control={form.control} render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input startIcon={Key} placeholder="Пароль" type="password" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} name="password"/>
                <Button className="bg-[#224A88] hover:bg-blue-900 active:bg-blue-950 self-center"
                        type="submit">Зарегистрироваться</Button>
            </form>
        </Form>
    )
};

RegisterForm.displayName = "RegisterForm";

export default RegisterForm;