saldo = 500000

while True:

    print("-------- Menu ---------")
    print("1. Cek Saldo")
    print("2. Tarik Tunai")
    print("3. Setor Tunai")
    print("4. Keluar")
    print("-----------------------")

    menu = int(input("Pilih Menu: "))

    if menu == 1:
        print(f"Saldo Anda: {saldo}")

    elif menu == 2:
        tarik = int(input("Masukkan nominal: "))

        if tarik <= 50000:
            sisa_tarik = saldo - tarik 
            print(f"Penarikan berhasil!")
            print(f"Sisa Saldo anda: {sisa_tarik}")

        else:
            print("Saldo anda tidak cukup!")

    elif menu == 4:
        print("Program Selesai.")
        break