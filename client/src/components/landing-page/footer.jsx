import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DribbbleIcon, GithubIcon, TwitchIcon, TwitterIcon } from 'lucide-react';

const footerLinks = [
  {
    title: 'Fitur',
    href: '/#fitur',
  },
  {
    title: 'FAQ',
    href: '/#faq',
  },
  {
    title: 'Pesan',
    href: '/pesan',
  },
];

const Footer = () => {
  return (
    <footer className="dark:border-t mt-40 dark bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div>
            {/* Logo */}
            <b>OMELAN</b>

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <a href={href} className="text-muted-foreground hover:text-foreground">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground text-center sm:text-start">
            &copy; {new Date().getFullYear()}{' '}
            <a href="/" target="_blank">
              OMELAN
            </a>
            . All rights reserved.
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <a href="#" target="_blank">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <DribbbleIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <TwitchIcon className="h-5 w-5" />
            </a>
            <a href="#" target="_blank">
              <GithubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
