'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function StandardFooter() {
  return (
    <footer className="relative z-10 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center rounded-xl bg-white px-3.5 py-2.5">
              <img alt="VOC Vertex" className="h-9 md:h-10 w-auto object-contain" src="/logo.png" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400 font-light">
              The vertex of enterprise modularity. Deploy standalone business applications or an industry-tailored package on one intelligent operations platform.
            </p>
            <div>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
                href="/login"
              >
                <span>Log in to platform</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
            <div>
              <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">Modules</p>
              <ul className="mt-4 space-y-2.5 font-light">
                <li><Link href="/#contact" className="hover:text-white transition-colors">OPS Core</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">CRM &amp; Bidding</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">HRM &amp; Workforce</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Procurement</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Inventory &amp; Warehouse</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Finance &amp; Accounts</Link></li>
              </ul>
            </div>

            <div>
              <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">More modules</p>
              <ul className="mt-4 space-y-2.5 font-light">
                <li><Link href="/#contact" className="hover:text-white transition-colors">Master Data</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Project &amp; Site IQ</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Workflow Automation</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Platform Admin</Link></li>
              </ul>
            </div>

            <div>
              <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">Industries</p>
              <ul className="mt-4 space-y-2.5 font-light">
                <li><Link className="hover:text-white transition-colors" href="/industry/manufacturing">Manufacturing &amp; Plants</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/industry/infra">Infrastructure &amp; EPC</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/industry/facilities">Facilities Management</Link></li>
              </ul>
            </div>

            <div>
              <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">Company</p>
              <ul className="mt-4 space-y-2.5 font-light">
                <li><Link className="hover:text-white transition-colors" href="/pricing">Pricing</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/#contact">Contact sales</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500">
          <p>© 2026 VOC Vertex. Intelligent operational systems for modern enterprise infrastructure.</p>
          <div className="flex items-center gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
