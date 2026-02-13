'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Phone, MapPin, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-16 mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg">
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <User className="h-16 w-16 text-gray-400" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.role.replace('_', ' ')}</span>
              </div>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Contact Information
              </h2>

              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="font-medium">+1 234 567 8900</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium">123 Education Street, City</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                System Information
              </h2>

              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Joined Date</p>
                  <p className="font-medium">February 13, 2026</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account Status</p>
                  <p className="font-medium text-green-600 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
