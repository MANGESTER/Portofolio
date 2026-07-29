while True:

    saldo = 0

    print("====== Menu ======")
    print("1. Cek Saldo")
    print("2. Tarik Tunai")
    print("3. Setor Tunai")
    print("4. Keluar")

    menu = int(input("Pilih menu: "))

    if menu == 1:
        print(f"Saldo anda: {saldo}")

    elif menu == 2:
        tarik = int(input("Masukkan nominal: "))
        saldo = saldo - tarik
        print(f"Sisa Saldo: {saldo}")

    elif menu == 3:
        setor = int(input("Masukkan nominal: "))
        saldo = saldo + setor
        print(f"Saldo Anda: {saldo}")

    else:
        print("Program Selesai.")
        break 