export default function CookiePolicyContent() {
  return (
    <div className='max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-2xl border border-black/5'>
      <h1 className='text-3xl font-bold text-text-primary'>Cookie Policy</h1>

      <p className='text-sm text-text-secondary'>
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          1. What Are Cookies
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          Cookies are small pieces of text sent to your web browser by a website
          you visit. They help the website remember information about your
          visit, making it easier to re-visit and offering a more personalized
          experience.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          2. Essential Cookies
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          We use essential cookies strictly to authenticate users and prevent
          fraudulent use of our user accounts. Without these, our core services,
          such as accessing your dashboard or scheduling an appointment, would
          not function.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          3. Analytics Cookies
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          We may deploy anonymized analytical cookies to understand how visitors
          interact with our application. This data is used to optimize clinical
          workflows, enhance UI features, and resolve any software errors.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          4. Managing Your Preferences
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          You can configure your browser to decline certain cookies. However,
          disabling all cookies will result in The Care Nexus portals
          functioning improperly. We do not use third-party advertising cookies
          that track your data off our specific platform.
        </p>
      </section>
    </div>
  );
}
