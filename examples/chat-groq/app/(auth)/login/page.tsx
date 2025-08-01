"use client"

import { googleLogin } from "../actions"

export default function Page() {
  // const router = useRouter()

  // const [email, setEmail] = useState("")
  // const [isSuccessful, setIsSuccessful] = useState(false)

  // const [state, formAction] = useActionState<LoginActionState, FormData>(
  //   login,
  //   {
  //     status: "idle",
  //   }
  // )

  // useEffect(() => {
  //   if (state.status === 'failed') {
  //     toast({
  //       type: 'error',
  //       description: 'Invalid credentials!',
  //     });
  //   } else if (state.status === 'invalid_data') {
  //     toast({
  //       type: 'error',
  //       description: 'Failed validating your submission!',
  //     });
  //   } else if (state.status === 'success') {
  //     setIsSuccessful(true);
  //     router.refresh();
  //   }
  // }, [state.status, router]);

  // const handleSubmit = (formData: FormData) => {
  //   setEmail(formData.get('email') as string);
  //   formAction(formData);
  // };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <form action={googleLogin}>
        <button type="submit">Sign in with Google</button>
      </form>
    </div>
  )
}
