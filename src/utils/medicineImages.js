
/**
 * Utility to map medicines to relevant pharmaceutical images based on their name and category.
 * Provides a curated list of high-quality Unsplash images for a professional pharmacy feel.
 */

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop';

const CATEGORY_IMAGES = {
    'Antibiotics': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop',
    'Painkillers': 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=800&auto=format&fit=crop',
    'Analgesic': 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=800&auto=format&fit=crop',
    'Antiviral': 'https://images.unsplash.com/photo-1576091160550-2173bdd9962a?q=80&w=800&auto=format&fit=crop',
    'Vitamins': 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?q=80&w=800&auto=format&fit=crop',
    'Supplements': 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?q=80&w=800&auto=format&fit=crop',
    'Cardiovascular': 'https://images.unsplash.com/photo-1632345031435-07ca66bc2578?q=80&w=800&auto=format&fit=crop',
    'Respiratory': 'https://images.unsplash.com/photo-1582719202047-76d3432ee323?q=80&w=800&auto=format&fit=crop',
    'Dermatology': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    'Antiseptic': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
    'Diabetes': 'https://images.unsplash.com/photo-1508847154043-be1277f7516d?q=80&w=800&auto=format&fit=crop',
    'Insulin': 'https://images.unsplash.com/photo-1508847154043-be1277f7516d?q=80&w=800&auto=format&fit=crop',
    'First Aid': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800&auto=format&fit=crop',
    'Cold & Flu': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop',
};

const MEDICINE_NAME_KEYWORDS = [
    { keywords: ['Paracetamol', 'Panado', 'Aspirin', 'Ibuprofen'], image: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=800&auto=format&fit=crop' },
    { keywords: ['Amoxicillin', 'Penicillin', 'Augmentin'], image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop' },
    { keywords: ['Vitamin', 'Omega', 'Calcium', 'Zinc'], image: 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?q=80&w=800&auto=format&fit=crop' },
    { keywords: ['Syrup', 'Cough', 'Liquid'], image: 'https://images.unsplash.com/photo-1555633514-abcee6ad93e1?q=80&w=800&auto=format&fit=crop' },
    { keywords: ['Cream', 'Ointment', 'Gel'], image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop' },
    { keywords: ['Inhaler', 'Asthma'], image: 'https://images.unsplash.com/photo-1582719202047-76d3432ee323?q=80&w=800&auto=format&fit=crop' },
    { keywords: ['Insulin', 'Injection', 'Vaccine'], image: 'https://images.unsplash.com/photo-1508847154043-be1277f7516d?q=80&w=800&auto=format&fit=crop' },
];

/**
 * Gets a relevant image URL for a medicine based on its name and category.
 * @param {Object} medicine The medicine object containing name and category
 * @returns {string} The resolved image URL
 */
export const getMedicineImage = (medicine) => {
    if (!medicine) return DEFAULT_IMAGE;
    
    // If the medicine already has an explicit image URL, use it
    if (medicine.imageUrl && medicine.imageUrl.trim() !== '') {
        return medicine.imageUrl;
    }

    const name = (medicine.name || '').toLowerCase();
    const category = (medicine.category || '').toLowerCase();

    // 1. Try to match by name keywords
    for (const group of MEDICINE_NAME_KEYWORDS) {
        if (group.keywords.some(kw => name.includes(kw.toLowerCase()))) {
            return group.image;
        }
    }

    // 2. Try to match by exact category
    for (const [cat, img] of Object.entries(CATEGORY_IMAGES)) {
        if (category === cat.toLowerCase()) {
            return img;
        }
    }

    // 3. Try to match by category keyword
    for (const [cat, img] of Object.entries(CATEGORY_IMAGES)) {
        if (category.includes(cat.toLowerCase())) {
            return img;
        }
    }

    // Fallback to default pharmaceutical placeholder
    return DEFAULT_IMAGE;
};
