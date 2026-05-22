import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-6">
      <section className="max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-soft">
        <CheckCircle2 className="mx-auto text-tea" size={64} />
        <h1 className="mt-6 font-display text-4xl font-bold">Payment Successful / 支付成功</h1>
        <p className="mt-4 leading-7 text-ink/68">
          Your paid course order has been saved locally. 课程订单已创建，Lucy老师会根据预约信息联系你。
        </p>
        {params.order && <p className="mt-4 rounded-2xl bg-mint p-3 text-sm font-bold">Order ID: {params.order}</p>}
        <Link href="/" className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 font-bold text-white">
          Back Home / 返回首页
        </Link>
      </section>
    </main>
  );
}
