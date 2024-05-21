import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Mail, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import apiClient from "@/lib/api-client";
import {toast} from "sonner";
import {AuthResponse, User} from "@/types/Users";

const schema = z.object({
    email: z.string().email({
        message: "Введите корректную почту"
    }),
    username: z.string().min(5, {
        message: "Имя пользователя должно состоять хотя бы из 5 символов"
    }),
});

const EditForm: React.FC = () => {
    const {data: session, update} = useSession();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            username: "",
        },
        values: {
            email: session?.user?.email ?? "",
            username: session?.user?.username ?? "",
        }
    });

    async function onSubmit(values: z.infer<typeof schema>) {
        const res = (await apiClient.get<User>("users/me")).data
        try {
            const newSession = (await apiClient.put<AuthResponse>("users/", {
                ...res,
                email: values.email,
                username: values.username,
            })).data
            await update(newSession)
            toast.success("Изменения сохранены")
        } catch {
            toast.error("Что-то пошло не так")
        }

        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
                <FormField control={form.control} render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Электронная почта
                        </FormLabel>
                        <FormControl>
                            <Input startIcon={Mail} {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name="email"/>
                <FormField control={form.control} render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Имя пользователя
                        </FormLabel>
                        <FormControl>
                            <Input startIcon={UserRound} {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name="username"/>
                <Button className="bg-[#E1EAFF] text-[#0F172A] hover:bg-blue-200 active:bg-blue-300 self-center"
                        type="submit">Сохранить</Button>
            </form>
        </Form>
    )
}

export default EditForm;