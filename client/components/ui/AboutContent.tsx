import Image from 'next/image';

export default function AboutContent() {
  return (
    <div className='max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-2xl border border-black/5'>
      <div className='flex items-center gap-4'>
        <Image
          src='/logo1.png'
          alt='The Care Nexus'
          width={100}
          height={34}
          priority
          className='object-contain'
        />
      </div>
      <h1 className='text-3xl font-bold text-text-primary'>
        About The Care Nexus
      </h1>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          Why We Exist
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          Healthcare organizations still struggle with fragmented records,
          manual workflows, and disconnected communication channels. These
          challenges slow down care delivery, create operational inefficiencies,
          and make it harder for patients to stay engaged in their health
          journey. The Care Nexus exists to unify healthcare operations into one
          intelligent platform where patients, providers, and clinics can
          collaborate through secure records, real-time communication,
          AI-powered workflows, and streamlined care management.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>Our Mission</h2>
        <p className='text-text-secondary leading-relaxed'>
          At The Care Nexus, our mission is to revolutionize healthcare
          accessibility by connecting patients, doctors, and clinics seamlessly.
          We aim to empower individuals with technology, enabling digital
          healthcare solutions that prioritize convenience, transparency, and
          superior patient outcomes.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>Our Vision</h2>
        <p className='text-text-secondary leading-relaxed'>
          We envision a future where healthcare is intelligent, connected, and
          accessible to everyone. Our goal is to become the operating system for
          modern care delivery by combining AI, voice technology, patient
          engagement tools, and clinical workflow automation into a single
          platform. Through continuous innovation, The Care Nexus aims to help
          healthcare organizations deliver faster, safer, and more personalized
          care at scale.
        </p>
      </section>
    </div>
  );
}
