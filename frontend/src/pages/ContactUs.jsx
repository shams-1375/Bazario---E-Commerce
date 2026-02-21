import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ContactUs = () => {
    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">Get in Touch</h1>
                    <p className="text-gray-600 mt-4">Have questions? We're here to help you with your electronics needs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Email Us</h3>
                                <p className="text-gray-600">bazarioelectronics@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Call Us</h3>
                                <p className="text-gray-600">+91 98xxx 4xx10</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Visit Our Hub</h3>
                                <p className="text-gray-600">123 Tech Park, HiTech City, Hyderabad, India</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <form className="space-y-4">
                            <Input placeholder="Your Name" />
                            <Input placeholder="Email Address" type="email" />
                            <textarea
                                placeholder="How can we help?"
                                className="w-full min-h-30 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            ></textarea>
                            <Button className="w-full bg-teal-600 hover:bg-teal-700 py-6">
                                <Send className="w-4 h-4 mr-2" /> Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;