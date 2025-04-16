export const formatRp = (value = 0) => {
    try {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value).replace(',00', '');
    } catch (_) {
        return 'Rp 0';
    }
};
