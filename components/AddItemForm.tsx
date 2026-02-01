
import React, { useState, useRef, useEffect } from 'react';
import { Package, Hash, Layers, MapPin, AlignLeft, Send, Camera, X, Image as ImageIcon, RotateCcw, Check } from 'lucide-react';
import { Item } from '../types';

interface AddItemFormProps {
  onAdd: (item: Omit<Item, 'id' | 'lastChecked'>) => void;
  onCancel: () => void;
  initialData?: Item;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    quantity: initialData?.quantity || 0,
    location: initialData?.location || '',
    description: initialData?.description || '',
    image: initialData?.image || ''
  });
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Sync with initialData if it changes (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code,
        quantity: initialData.quantity,
        location: initialData.location,
        description: initialData.description || '',
        image: initialData.image || ''
      });
    }
  }, [initialData]);

  // Start camera stream
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
      setIsCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture photo from stream
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setFormData({ ...formData, image: imageData });
        stopCamera();
      }
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.location) {
        alert('Mohon lengkapi data wajib (Nama, Kode, Lokasi)');
        return;
    }
    onAdd(formData);
    stopCamera();
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className={`px-6 py-4 ${initialData ? 'bg-blue-600' : 'bg-indigo-600'}`}>
          <h2 className="text-white text-lg font-bold flex items-center">
            <Package className="mr-2 h-5 w-5" />
            {initialData ? `Edit Barang: ${initialData.name}` : 'Tambah Barang Baru'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Direct Camera Integration Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center">
                  <Camera className="h-4 w-4 mr-1 text-slate-400" />
                  Foto Barang
                </span>
                {formData.image && (
                  <button 
                    type="button" 
                    onClick={startCamera}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Ambil Ulang
                  </button>
                )}
            </label>
            
            <div className="relative">
              {isCameraActive ? (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner border-2 border-indigo-500 animate-in zoom-in-95 duration-200">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 px-4">
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={takePhoto}
                      className="bg-white text-indigo-600 p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-4 border-indigo-200"
                    >
                      <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                    </button>
                  </div>
                </div>
              ) : formData.image ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden group border border-slate-200 shadow-inner bg-slate-50">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <button 
                      type="button"
                      onClick={startCamera}
                      className="bg-white text-slate-800 p-2 rounded-lg flex items-center text-xs font-bold"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" /> Ulang
                    </button>
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white p-2 rounded-lg flex items-center text-xs font-bold"
                    >
                      <X className="h-4 w-4 mr-1" /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all group"
                  >
                    <div className="bg-indigo-600 p-3 rounded-full text-white mb-3 shadow-md group-hover:scale-110 transition-transform">
                      <Camera className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide">Buka Kamera</span>
                    <span className="text-[10px] text-indigo-400 mt-1">Ambil Foto Langsung</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-all"
                  >
                    <ImageIcon className="h-8 w-8 mb-3 text-slate-300" />
                    <span className="text-sm font-semibold">Pilih Galeri</span>
                    <span className="text-[10px] text-slate-400 mt-1">Upload File Foto</span>
                  </button>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
              <input 
                ref={galleryInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleGalleryUpload} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Hash className="h-4 w-4 mr-1 text-slate-400" />
                Nama Barang <span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
              placeholder="Contoh: Kertas A4 80gr"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Hash className="h-4 w-4 mr-1 text-slate-400" />
                  Kode Unik <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
                placeholder="SKU-001"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Layers className="h-4 w-4 mr-1 text-slate-400" />
                  Stok Awal
              </label>
              <input 
                type="number" 
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                Lokasi <span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
              placeholder="Contoh: Gudang A, Rak 2"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
                <AlignLeft className="h-4 w-4 mr-1 text-slate-400" />
                Deskripsi (Opsional)
            </label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50 resize-none"
              placeholder="Tambahkan keterangan tambahan jika ada..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center shadow-lg ${initialData ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              <Send className="h-4 w-4 mr-2" />
              {initialData ? 'Simpan Perubahan' : 'Simpan Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
