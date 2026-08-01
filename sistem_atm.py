saldo = 500000

def cek_saldo():
    print(f"Saldo anda: Rp{saldo:,}")

def tarik_tunai():
    global saldo 
    tarik = int(input("Masukkan Nominal: Rp"))

    if tarik > saldo:
        print("Saldo tidak mencukupi!")
        print(f"Saldo anda: Rp{saldo:,}")

    elif saldo - tarik < 50000:
        print("Tarik tunai gagal, minimal sisa saldo Rp50.000")

    else:
        saldo -= tarik
        print("Tarik Tunai Berhasil!")
        print(f"Saldo anda: Rp{saldo:,}")

def setor_tunai():
    global saldo
    setor = int(input("Masukkan Nominal: Rp"))

    if setor <= 0:
        print("Nominal tidak valid!")

    else:
        saldo += setor
        print("Setor tunai berhasil!")
        print(f"Saldo anda: Rp{saldo:,}")

while True:

    print("---------- Menu ----------")
    print("1. Cek Saldo")
    print("2. Tarik Tunai")
    print("3. Setor Tunai")
    print("4. Keluar")
    print("---------------------------")

    menu = int(input("Pilih menu: "))

    if menu == 1:
        cek_saldo()

    elif menu == 2:
        tarik_tunai()

    elif menu == 3:
        setor_tunai()

    elif menu == 4:
        print("Program Selesai!")
        break 

    else:
        print("Pilihan Tidak Valid!")