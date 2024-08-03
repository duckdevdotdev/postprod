import Image from "next/image";
import { Inter } from "next/font/google";
import SmsForm from "@/components/SmsForm";
import MessagesList from "@/components/MessagesList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
    <SmsForm/>
    <MessagesList/>
    </>
  );
}
