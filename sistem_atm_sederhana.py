while True:

    saldo_awal = None

    print("-------- Menu --------")
    print("1. Cek Saldo")
    print("2. Tarik Tunai")
    print("3. Setor Tunai")
    print("4. Keluar")
    print("-----------------------")

    menu = int(input("Pilih menu: "))

    if menu == 1:
        print(f"Saldo anda: {saldo_awal}")

    elif menu == 2:
        tarik = int(input("Masukkan nominal: "))

        if tarik <= saldo_awal:
            print("Saldo tidak mencukupi!")

        saldo = saldo_awal - tarik
        print(f"Sisa Saldo: {saldo_awal}")

    elif menu == 3:
        setor = int(input("Masukkan nominal: "))
        saldo = saldo_awal + setor
        print(f"Saldo Anda: {saldo_awal}")

    else:
        print("Program Selesai.")
        break 