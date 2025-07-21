import { Dialog } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import { Button as ShadcnButton } from "./ui/button"
import { Upload } from "lucide-react";
import { read, utils } from 'xlsx';
import { Description } from '@headlessui/react'

export default function UpdateInventory({ open, onClose, inventoryProps }) {
  const { inventory, setInventory, excelSheet, setExcelSheet } = inventoryProps;
  const [localInventory, setLocalInventory] = useState(inventory);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocalInventory(inventory)
  }, [inventory])

  const editProduct = (idx, key, value) => {
    setLocalInventory(r => r.map((row, i) => (i === idx ? { ...row, [key]: value } : row)))
  }

  const addProduct = () => setLocalInventory([...localInventory, { Item: '', Price: '', Quantity: '', Remarks: '' }])
  const deleteProduct = idx => setLocalInventory(localInventory.filter((_, i) => i !== idx))
  const clearInventory = () => {
    setLocalInventory([]);
    setExcelSheet(null);
  }

  const handleSave = () => {
    const errors = [];
    const validated = [];
  
    for (let i = 0; i < localInventory.length; i++) {
      const row = localInventory[i];
      const item = row.Item?.toString().trim();
      const remarks = row.Remarks ?? "";
      const price = parsePrice(row.Price);
      const quantity = parseQty(row.Quantity);
  
      if (!item || item === '') errors.push(`Row ${i + 1}: "Item" is required.`);
      if (price === null) errors.push(`Row ${i + 1}: Invalid price format. Please use a number.`);
      else if (price < 0) errors.push(`Row ${i + 1}: Price cannot be negative.`);
      if (quantity === null) errors.push(`Row ${i + 1}: Invalid quantity format. Please use a whole number.`);
      else if (quantity < 1) errors.push(`Row ${i + 1}: Quantity must be greater than 0.`);
  
      validated.push({ Item: item, Price: price, Quantity: quantity, Remarks: remarks });
    }
  
    if (errors.length > 0) {
      setErrors({ inventory: errors });
      return;
    }
  
    setInventory(validated);
    setErrors({});
    onClose();
  };

  const parsePrice = (val) => {
    if (typeof val === 'string') val = val.replace(/[$,]/g, '').trim();
    const num = parseFloat(val);
    return isNaN(num) ? null : parseFloat(num.toFixed(2));
  };

  const parseQty = (val) => {
    if (typeof val === 'string') val = val.trim();
    const num = Number(val);
    return  !Number.isInteger(num) ? null : num;
  };

  const handleFileUpload = async (e) => {
    setErrors({});
    const file = e.target.files?.[0]
    if (!file) {
      setErrors({'file_upload':'File not found'})
      return;
    }

    const extension = file.name.split('.').pop();
    if (!['xlsx', 'xls'].includes(extension)) {
      setErrors({'file_upload':'Unsupported file type. Please ensure that your file is .xlsx or .xls.'});
      return;
    }

    setExcelSheet(file)

    const ab = await file.arrayBuffer();
    const wb  = read(ab);
    const ws  = wb.Sheets[wb.SheetNames[0]];
    const rawData = utils.sheet_to_json(ws, { raw: true, defval: '' }); 

    const data = rawData.map(row => {
      const formattedRow = {};
      Object.entries(row).forEach(([key, value]) => {
        formattedRow[key.trim()] = typeof value === 'string' ? value.trim() : value;
      });
      return formattedRow;
    });
    for (const col of ['Item','Price','Quantity']) {
      if (!(col in data[0])) {
        setErrors({'file_upload':`Missing required column: "${col}".`});
        return;
      }
    }
    setLocalInventory(data);
  }

  return (
    <Dialog as={Fragment} open={open} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="max-w-3xl w-full rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Your Inventory</h2>
            <Description className="text-sm/6 text-black/50">Upload an Excel sheet if you have one</Description>
            <ShadcnButton variant="outline" size="sm" style={{ marginBottom: "10px" }}>
                  <Upload /> 
                  <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="block w-full"
                  />
            </ShadcnButton>
            {errors['file_upload'] && (
                        <p className="mb-3 text-sm text-red-600">{errors['file_upload']}</p>
                    )}
            <div className="overflow-auto max-h-[60vh]">
                <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    {Object.keys(localInventory?.[0] ?? { Item: '', Price: '', Quantity: '', Remarks: '' }).map(h => (
                      <th key={h} className="p-2 text-left">{h}</th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                    {localInventory?.map((row, idx) => (
                    <tr key={idx} className="border-b">
                        {Object.entries(row).map(([k, v]) => (
                        <td key={k} className="p-2">
                            <input
                              className="w-full bg-transparent border-b focus:outline-none"
                              value={v}
                              onChange={e => editProduct(idx, k, e.target.value)}
                            />
                        </td>
                        ))}
                        <td className="p-2">
                          <button onClick={() => deleteProduct(idx)} className="text-red-500 hover:text-red-700">Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {errors['inventory'] && (
                        <p className="mb-1 mt-2 text-sm text-red-600">{errors['inventory'][0]}</p>
                    )}
            </div>
            
            <div className="flex justify-between mt-4">
                <button onClick={addProduct} className="px-3 py-1 rounded bg-gray-200">Add Product</button>
                <button onClick={clearInventory} className="px-3 py-1 rounded bg-gray-200">Clear Inventory</button>
                <div>
                  <button onClick={onClose} className="mr-2 px-4 py-1 bg-gray-300 rounded">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-1 bg-indigo-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
      </div>
    </Dialog>
  )
}

