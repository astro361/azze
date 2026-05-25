/**
 * Azze Platform - Support Page
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink } from 'lucide-react';

export function Support() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Support & Contact</h1>
        <p className="text-slate-600">Get in touch with our team for assistance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Email Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center transition-all hover:shadow-md"
        >
          <div className="w-16 h-16 bg-[#c37a4c]/10 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#c37a4c]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Email Support</h2>
          <p className="text-slate-500 mb-6 flex-1">
            Send us an email anytime. Our team typically responds within 24 hours.
          </p>
          <a
            href="mailto:arcasy22@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors w-full"
          >
            arcasy22@gmail.com
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Phone/WhatsApp Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center transition-all hover:shadow-md"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
            <Phone className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Phone & WhatsApp</h2>
          <p className="text-slate-500 mb-6 flex-1">
            Need urgent assistance? Call us directly or send a message on WhatsApp.
          </p>
          <a
            href="tel:+919539213484"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors w-full"
          >
            +91 9539213484
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      <div className="mt-12 text-center text-slate-500 text-sm">
        <p>Support hours: Monday to Friday, 9:00 AM - 6:00 PM (IST)</p>
        <p className="mt-1">For critical deployment issues, use the urgent contact line.</p>
      </div>
    </div>
  );
}