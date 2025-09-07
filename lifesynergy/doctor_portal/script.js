// Import Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Config
const supabaseUrl = 'https://clxuhmohunqntgynwmkm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseHVobW9odW5xbnRneW53bWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDg2NDMsImV4cCI6MjA3MjcyNDY0M30.gLPMfIREp-zCS5B3x5bbfAeHEWdjS1pDWA1Wu72LxHA'; // <-- replace with your anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM
const form = document.getElementById('aadhaarForm');
const input = document.getElementById('aadhaarInput');
const result = document.getElementById('result');

// On submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const aadhaar = (input.value || '').trim();

  if (!/^\d{12}$/.test(aadhaar)) {
    alert('Please enter a valid 12-digit Aadhaar number.');
    return;
  }

  result.innerHTML = `<p class="text-gray-500">🔍 Searching...</p>`;

  try {
    const { data, error } = await supabase
      .rpc('get_migrant_by_aadhaar', { aadhaar_input: aadhaar })
      .single();

    if (error || !data) {
      console.error(error);
      result.innerHTML = `<p class="text-red-600">❌ No record found.</p>`;
      return;
    }

    // Build details table
    // result.innerHTML = `
    //   <div class="bg-white shadow rounded p-4">
    //     <h2 class="text-lg font-bold mb-3">Migrant Details</h2>
    //     <table class="table-auto w-full text-sm">
    //       <tbody>
    //         <tr><td class="font-medium pr-2">Full Name:</td><td>${data.full_name}</td></tr>
    //         <tr><td class="font-medium pr-2">DOB:</td><td>${data.dob}</td></tr>
    //         <tr><td class="font-medium pr-2">Gender:</td><td>${data.gender}</td></tr>
    //         <tr><td class="font-medium pr-2">State:</td><td>${data.state_origin}</td></tr>
    //         <tr><td class="font-medium pr-2">Languages:</td><td>${data.languages}</td></tr>
    //         <tr><td class="font-medium pr-2">Contact:</td><td>${data.contact_number}</td></tr>
    //         <tr><td class="font-medium pr-2">Emergency:</td><td>${data.emergency_contact}</td></tr>
    //         <tr><td class="font-medium pr-2">Current Address:</td><td>${data.current_address}</td></tr>
    //         <tr><td class="font-medium pr-2">Permanent Address:</td><td>${data.permanent_address}</td></tr>
    //         <tr><td class="font-medium pr-2">Employer:</td><td>${data.employer}</td></tr>
    //         <tr><td class="font-medium pr-2">Work Sector:</td><td>${data.work_sector}</td></tr>
    //         <tr><td class="font-medium pr-2">Worksite:</td><td>${data.worksite_location}</td></tr>
    //         <tr><td class="font-medium pr-2">Entry Date:</td><td>${data.entry_date}</td></tr>
    //         <tr><td class="font-medium pr-2">Aadhaar:</td><td>${data.aadhaar}</td></tr>
    //         <tr><td class="font-medium pr-2">Allergies:</td><td>${data.allergies}</td></tr>
    //         <tr><td class="font-medium pr-2">Blood Group:</td><td>${data.blood_group}</td></tr>
    //         <tr><td class="font-medium pr-2">Conditions:</td><td>${data.conditions}</td></tr>
    //         <tr><td class="font-medium pr-2">Immunizations:</td><td>${data.immunizations}</td></tr>
    //         <tr><td class="font-medium pr-2">Linked Facility:</td><td>${data.linked_facility}</td></tr>
    //       </tbody>
    //     </table>
    //   </div>
    // `;


    // Build details table (improved design)
result.innerHTML = `
  <div class="bg-white shadow-2xl rounded-2xl p-6 fade-in hover-scale">
    <h2 class="text-xl font-bold mb-4 text-gray-800 border-b pb-2">🧾 Migrant Details</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <tbody class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Full Name</td>
            <td class="px-4 py-2 text-gray-600">${data.full_name}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">DOB</td>
            <td class="px-4 py-2 text-gray-600">${data.dob}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Gender</td>
            <td class="px-4 py-2 text-gray-600">${data.gender}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">State</td>
            <td class="px-4 py-2 text-gray-600">${data.state_origin}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Languages</td>
            <td class="px-4 py-2 text-gray-600">${data.languages}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Contact</td>
            <td class="px-4 py-2 text-gray-600">${data.contact_number}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Emergency</td>
            <td class="px-4 py-2 text-gray-600">${data.emergency_contact}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Current Address</td>
            <td class="px-4 py-2 text-gray-600">${data.current_address}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Permanent Address</td>
            <td class="px-4 py-2 text-gray-600">${data.permanent_address}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Employer</td>
            <td class="px-4 py-2 text-gray-600">${data.employer}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Work Sector</td>
            <td class="px-4 py-2 text-gray-600">${data.work_sector}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Worksite</td>
            <td class="px-4 py-2 text-gray-600">${data.worksite_location}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Entry Date</td>
            <td class="px-4 py-2 text-gray-600">${data.entry_date}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Aadhaar</td>
            <td class="px-4 py-2 text-gray-600">${data.aadhaar}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Allergies</td>
            <td class="px-4 py-2 text-gray-600">${data.allergies}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Blood Group</td>
            <td class="px-4 py-2 text-gray-600">${data.blood_group}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Conditions</td>
            <td class="px-4 py-2 text-gray-600">${data.conditions}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Immunizations</td>
            <td class="px-4 py-2 text-gray-600">${data.immunizations}</td>
          </tr>
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2 font-medium text-gray-700">Linked Facility</td>
            <td class="px-4 py-2 text-gray-600">${data.linked_facility}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;





  } catch (err) {
    console.error(err);
    result.innerHTML = `<p class="text-red-600">⚠️ Error: ${err.message}</p>`;
  }
});
