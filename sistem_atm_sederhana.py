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

        if tarik <= saldo:
            saldo = saldo - tarik 

            if saldo <= 50000:
                print("Tarik tunai gagal!, minimal sisa saldo Rp50.000")
            else:
                print(f"Penarikan berhasil!")
                print(f"Sisa Saldo anda: {saldo}")
    
        else:
            print("Saldo anda tidak cukup!")

    elif menu == 3:
        setor = int(input("Masukkan nominal: "))

        if setor <= 0:
            print("Maaf, nominal yang anda masukkan tidak valid!")

        else:
            saldo = saldo + setor 
            print("Setor Tunai Berhasil!")
            print(f"Saldo anda: {saldo}")

    elif menu == 4:
        print("Program Selesai.")
        break

    else:
        print("No Menu TIdak Valid.")