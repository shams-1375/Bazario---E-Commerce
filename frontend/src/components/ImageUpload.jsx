import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X } from 'lucide-react'

const ImageUpload = ({ productData, setProductData }) => {

  const handleFile = (e) => {
    const files = Array.from(e.target.files || []) 
    if(files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files]
      }))
    }
  }

  const removeImg = (index) => {
      setProductData((prev) => {
        const updatedImages = prev.productImg.filter((_, i)=> i !== index)
        return {...prev, productImg:updatedImages}
      })
  }

  
  const openFileInput = () => {
    document.getElementById("file-upload").click()
  }

  return (
    <div className='grid gap-2'>
      <Label>Product Image</Label>
      <Input type="file" id="file-upload" className="hidden" accept="image/*" multiple onChange={handleFile} ></Input>
      <Button variant='outline' className='cursor-pointer' onClick={openFileInput} >
        <label htmlFor='file-upload' >Upload Images</label>
      </Button>

      {
        productData.productImg.length > 0 && (
          <div className='grid grid-cols-2 mt-3 gap-4 sm:grid-cols-3'>
            {
              productData.productImg.map((file, idx) => {
                let preview
                if (file instanceof File) {
                  preview = URL.createObjectURL(file)
                } else if (typeof file === 'string') {
                  preview = file
                } else if (file?.url) {
                  preview = file.url
                } else {
                  return null
                }

                return (
                  <Card key={idx} className="relative group overflow-hidden">
                    <CardContent >
                      <img src={preview} alt='' width={200} height={200} className='w-full h-32 object-cover rounded-md' />

                      <button className='absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition'><X onClick={()=> removeImg(idx)} size={14} /></button>
                    </CardContent>

                  </Card>
                )
              })
            }
          </div>
        )
      }

    </div>
  )
}

export default ImageUpload
