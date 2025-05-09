
import React from 'react';
import DestinationFormContainer from '@/components/admin/DestinationForm/DestinationFormContainer';

const DestinationForm = () => {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Tambah Destinasi Baru</h1>
          <p className="text-gray-500">Isi formulir untuk menambahkan destinasi wisata baru</p>
        </div>
      </div>

      <DestinationFormContainer />
    </div>
  );
};

export default DestinationForm;
