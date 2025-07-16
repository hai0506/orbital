import { Dialog } from '@headlessui/react'
import { useState, Fragment, useEffect } from 'react'
import { Button as ShadcnButton } from "./ui/button"
import { Upload } from "lucide-react";
import { read, utils } from 'xlsx';
import { Description } from '@headlessui/react'

export default function UpdateInventory({ open, onClose, inventoryProps }) {
  const { inventory, setInventory, excelSheet, setExcelSheet } = inventoryProps;
  const [localInventory, setLocalInventory] = useState(inventory);

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
    setInventory(localInventory);
    onClose();
  }

  return (
    <Dialog as={Fragment} open={open} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="max-w-3xl w-full rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Your Inventory</h2>
            <Description className="text-sm/6 text-black/50">Upload an Excel sheet if you have one</Description>
            <ShadcnButton variant="outline" size="sm" style={{ marginBottom: "10px" }}>
                  <Upload /> 
                  <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={async e => {
                          const file = e.target.files?.[0]
                          if (!file) return

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

                          const cols = ["Item", "Price", "Quantity", "Remarks"];
                          setLocalInventory(data.map(row => {
                            const temp = {};
                            cols.forEach(col => temp[col] = row[col] ?? '');
                            return temp;
                          }));
         
                      }}
                      className="block w-full"
                  />
            </ShadcnButton>
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

