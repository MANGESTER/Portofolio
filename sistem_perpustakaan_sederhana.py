buku = [
    "Oppenheimer",
    "Laskar Pelangi",
    "Cahaya di Kemulik Badai"
]

while True:
    print("========= Perpustakaan ========")
    print("1. Lihat daftar buku")
    print("2. Tambah buku")
    print("3. Hapus buku")
    print("4. Keluar")
    print("================================")

    menu = int(input("Pilih menu: "))

    if menu == 1:
        print("======== Daftar Buku =========")
        for i in buku:
            print(i + 1)
            print(buku[i])

    elif menu == 2:
        pass

    elif menu == 3:
        pass 

    elif menu == 4:
        print("Program selesai.")
        break 

    else:
        print("Menu tidak sesuai.")