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
        print(f"Saldo Anda:Rp{saldo:,}")

    elif menu == 2:
        tarik = int(input("Masukkan nominal: "))

        if tarik > saldo:
            print("Saldo tidak cukup!")

        elif saldo - tarik <= 50000:
            print("Penarikan gagal, saldo setelah penarikan minimal Rp50.000")

        else:
            saldo -= tarik
            print("Penarikan berhasil!")
            print(f"Sisa saldo anda:Rp{saldo:,}")

    elif menu == 3:
        setor = int(input("Masukkan nominal: "))

        if setor <= 0:
            print("Maaf, nominal yang anda masukkan tidak valid!")

        else:
            saldo = saldo + setor 
            print("Setor Tunai Berhasil!")
            print(f"Saldo anda:Rp{saldo:,}")

    elif menu == 4:
        print("Program Selesai.")
        break

    else:
        print("No Menu TIdak Valid.")