'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { createClient } from '@/lib/supabase'
import { District } from '@/types'
import Link from 'next/link'

export default function DistrictsManagementPage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    delivery_charge: '',
  })

  useEffect(() => {
    fetchDistricts()
  }, [])

  useEffect(() => {
    const filtered = districts.filter((district) =>
      district.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDistricts(filtered)
  }, [districts, searchTerm])

  const fetchDistricts = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from('districts').select('*').order('name')

      if (error) throw error

      setDistricts(data || [])
    } catch (error) {
      console.error('Error fetching districts:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      delivery_charge: '',
    })
    setEditingDistrict(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (district: District) => {
    setEditingDistrict(district)
    setFormData({
      name: district.name || '',
      delivery_charge: district.delivery_charge?.toString() || '',
    })
    setIsDialogOpen(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()

      const districtData = {
        name: formData.name,
        delivery_charge: parseFloat(formData.delivery_charge) || 0,
      }

      if (editingDistrict) {
        // Update existing district
        const { error } = await supabase
          .from('districts')
          .update({ ...districtData, updated_at: new Date().toISOString() })
          .eq('id', editingDistrict.id)

        if (error) throw error
      } else {
        // Create new district
        const { error } = await supabase.from('districts').insert([districtData])

        if (error) throw error
      }

      await fetchDistricts()
      setIsDialogOpen(false)
      resetForm()
      alert(editingDistrict ? 'District updated successfully!' : 'District created successfully!')
    } catch (error) {
      console.error('Error saving district:', error)
      alert('Error saving district. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const deleteDistrict = async (district: District) => {
    if (
      !confirm(`Are you sure you want to delete "${district.name}"? This action cannot be undone.`)
    ) {
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.from('districts').delete().eq('id', district.id)

      if (error) throw error

      await fetchDistricts()
      alert('District deleted successfully!')
    } catch (error) {
      console.error('Error deleting district:', error)
      alert('Error deleting district. Please try again.')
    }
  }

  const populateBangladeshDistricts = async () => {
    if (
      !confirm(
        'This will add all 64 districts of Bangladesh with default shipping costs. Continue?'
      )
    ) {
      return
    }

    const bangladeshDistricts = [
      'Bagerhat',
      'Bandarban',
      'Barguna',
      'Barisal',
      'Bhola',
      'Bogra',
      'Brahmanbaria',
      'Chandpur',
      'Chittagong',
      'Chuadanga',
      'Comilla',
      "Cox's Bazar",
      'Dhaka',
      'Dinajpur',
      'Faridpur',
      'Feni',
      'Gaibandha',
      'Gazipur',
      'Gopalganj',
      'Habiganj',
      'Jamalpur',
      'Jessore',
      'Jhalokati',
      'Jhenaidah',
      'Joypurhat',
      'Khagrachhari',
      'Khulna',
      'Kishoreganj',
      'Kurigram',
      'Kushtia',
      'Lakshmipur',
      'Lalmonirhat',
      'Madaripur',
      'Magura',
      'Manikganj',
      'Meherpur',
      'Moulvibazar',
      'Munshiganj',
      'Mymensingh',
      'Naogaon',
      'Narail',
      'Narayanganj',
      'Narsingdi',
      'Natore',
      'Nawabganj',
      'Netrokona',
      'Nilphamari',
      'Noakhali',
      'Pabna',
      'Panchagarh',
      'Patuakhali',
      'Pirojpur',
      'Rajbari',
      'Rajshahi',
      'Rangamati',
      'Rangpur',
      'Satkhira',
      'Shariatpur',
      'Sherpur',
      'Sirajganj',
      'Sunamganj',
      'Sylhet',
      'Tangail',
      'Thakurgaon',
    ]

    const supabase = createClient()

    try {
      setSaving(true)

      // Check which districts already exist
      const { data: existingDistricts } = await supabase.from('districts').select('name')

      const existingNames = existingDistricts?.map((d) => d.name) || []
      const newDistricts = bangladeshDistricts
        .filter((name) => !existingNames.includes(name))
        .map((name) => ({
          name,
          delivery_charge: name === 'Dhaka' ? 60 : 120, // Dhaka: 60 BDT, Others: 120 BDT
        }))

      if (newDistricts.length === 0) {
        alert('All Bangladesh districts are already added!')
        return
      }

      const { error } = await supabase.from('districts').insert(newDistricts)

      if (error) throw error

      await fetchDistricts()
      alert(`Successfully added ${newDistricts.length} new districts!`)
    } catch (error) {
      console.error('Error populating districts:', error)
      alert('Error adding districts. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '৳0'
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/settings">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Settings
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Districts Management</h1>
                <p className="text-gray-600">Manage delivery districts and shipping charges</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={populateBangladeshDistricts} disabled={saving}>
                Add Bangladesh Districts
              </Button>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add District
              </Button>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search districts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{districts.length}</p>
                  <p className="text-sm text-gray-600">Total Districts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {districts.length > 0
                      ? formatCurrency(
                          districts.reduce((sum, d) => sum + Number(d.delivery_charge), 0) /
                            districts.length
                        )
                      : '৳0'}
                  </p>
                  <p className="text-sm text-gray-600">Avg. Shipping</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Districts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Districts ({filteredDistricts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDistricts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'No districts found matching your search' : 'No districts found'}
                  </p>
                  {!searchTerm && (
                    <div className="space-y-2">
                      <Button onClick={openAddDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First District
                      </Button>
                      <p className="text-sm text-gray-500">or</p>
                      <Button variant="outline" onClick={populateBangladeshDistricts}>
                        Add All Bangladesh Districts
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District Name</TableHead>
                      <TableHead>Shipping Cost</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistricts.map((district) => (
                      <TableRow key={district.id}>
                        <TableCell>
                          <p className="font-medium">{district.name}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(district.delivery_charge)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {new Date(district.created_at).toLocaleDateString('en-BD')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(district)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDistrict(district)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDistrict ? 'Edit District' : 'Add New District'}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">District Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Dhaka"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="delivery_charge">Delivery Charge (৳) *</Label>
                  <Input
                    id="delivery_charge"
                    type="number"
                    step="0.01"
                    value={formData.delivery_charge}
                    onChange={(e) => handleInputChange('delivery_charge', e.target.value)}
                    placeholder="e.g., 60"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Delivery charge for this district</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingDistrict ? 'Update District' : 'Add District'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
