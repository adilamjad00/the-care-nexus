export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className='min-h-screen font-sans relative overflow-hidden'
      style={{ background: '#e8f1fc' }}
    >
      <main className='relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-6 sm:py-12'>
        <div className='w-full max-w-110'>{children}</div>
      </main>
    </div>
  );
}
