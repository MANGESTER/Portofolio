data = [4,2,6,8,3,5,17,9]

terbesar = data[0]
posisi = 0

for i in range(len(data)):
    if data[i] > terbesar:
        terbesar = data[i]
        posisi = i

print(data[i])