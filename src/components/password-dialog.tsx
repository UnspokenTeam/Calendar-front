import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Key} from "lucide-react";
import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import apiClient from "@/lib/api-client";
import {AuthResponse, User} from "@/types/Users";
import {toast} from "sonner";
import {useSession} from "next-auth/react";

const passwordSchema = z.object({
    password: z.string().min(10, {
        message: "Минимальная длина пароля 10 символов"
    }),
});


const PasswordDialog: React.FC = () => {
    const {data: session, update} = useSession();
    const [open, setOpen] = React.useState<boolean>(false);
    const form = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof passwordSchema>) {
        const res = (await apiClient.get<User>("users/me")).data
        try {
            const newSession = (await apiClient.put<AuthResponse>("users/", {
                ...res,
                password: values.password
            })).data
            await update(newSession)
            toast.success("Изменения сохранены")
        } catch {
            toast.error("Что-то пошло не так")
        }
        setOpen(false)

        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-[#E1EAFF] text-[#0F172A] hover:bg-blue-200 active:bg-blue-300 self-center">
                    Изменить пароль
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Изменение пароля
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
                        <FormField control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input type="password" startIcon={Key} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} name="password"/>
                        <DialogFooter>
                            <Button type="submit">Сохранить</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default PasswordDialog;