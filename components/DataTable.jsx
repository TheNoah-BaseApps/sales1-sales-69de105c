'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DataTable({ 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  onView, 
  onCreate,
  searchable = false,
  creatable = false,
  tableName = ''
}) {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter(item => 
        Object.values(item).some(val => 
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete this ${tableName.slice(0, -1) || 'record'}?`)) {
      onDelete(id);
    }
  };

  const handleView = (id) => {
    onView(id);
  };

  const handleEdit = (id) => {
    onEdit(id);
  };

  const handleCreate = () => {
    onCreate();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {creatable && (
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          )}
        </div>

        {searchable && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="font-semibold text-gray-700">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="py-3">
                      {column.badge ? (
                        <Badge variant={item[column.key] ? "default" : "secondary"}>
                          {item[column.key] ? 'Active' : 'Inactive'}
                        </Badge>
                      ) : column.date ? (
                        new Date(item[column.key]).toLocaleDateString()
                      ) : (
                        item[column.key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right py-3">
                    <div className="flex justify-end items-center gap-2">
                      {onView && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(item.id)}
                          aria-label="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}