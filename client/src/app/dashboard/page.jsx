'use client';

export default function DashboardPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
            <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-6">
                Horrah!!! You are logged in successfully. Welcome to your dashboard!
            </p>
            </div>
            {/*
              Add your dashboard content here
            */}
        </div>
        </main>
    );
}