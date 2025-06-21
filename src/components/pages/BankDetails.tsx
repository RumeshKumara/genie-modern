import Button from '../ui/Button';
import { useState } from 'react';

export default function BankDetails() {
  const [form, setForm] = useState({
    name: '',
    account: '',
    ifsc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Bank details submitted!');
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-12 bg-white shadow rounded-xl">
      <h2 className="mb-4 text-2xl font-bold">Bank Account Details</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-sm font-medium">Account Holder Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Bank Account Number</label>
          <input
            type="text"
            name="account"
            value={form.account}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter account number"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">IFSC Code</label>
          <input
            type="text"
            name="ifsc"
            value={form.ifsc}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter IFSC code"
            required
          />
        </div>
        <Button type="submit" className="w-full text-white bg-primary">Submit</Button>
      </form>
    </div>
  );
}
