// ================================
// KONFIGURASI API
// ================================

const API_URL = "https://script.google.com/macros/s/AKfycbziQHQ4Gd-j8vrWA7ufqEaRgokDTcBhgmGbidNE_MS3Ll_RMXA4CbscUO8opDJ2nEiClA/exec";
let daftarHP = [];

// ================================
// NAVIGASI HALAMAN
// ================================

const menuItems =
  document.querySelectorAll(
    ".menu-item"
  );

const pages =
  document.querySelectorAll(
    ".page"
  );

const pageTitle =
  document.getElementById(
    "pageTitle"
  );

const pageDescription =
  document.getElementById(
    "pageDescription"
  );


const pageInfo = {

  dashboard: {
    title: "Dashboard",
    description:
      "Ringkasan bisnis jual beli HP"
  },

  stok: {
    title: "Stok HP",
    description:
      "Kelola HP yang masih tersedia"
  },

  tambah: {
    title: "Tambah HP",
    description:
      "Tambahkan data HP baru"
  },

  history: {
    title: "History Penjualan",
    description:
      "Daftar HP yang sudah terjual"
  },

  rekap: {
    title: "Rekap Bulanan",
    description:
      "Ringkasan keuntungan setiap bulan"
  }

};


menuItems.forEach(
  (menu) => {

    menu.addEventListener(
      "click",
      () => {

        const targetPage =
          menu.dataset.page;


        menuItems.forEach(
          (item) => {

            item.classList.remove(
              "active"
            );

          }
        );


        pages.forEach(
          (page) => {

            page.classList.remove(
              "active-page"
            );

          }
        );


        menu.classList.add(
          "active"
        );


        document
          .getElementById(
            targetPage
          )
          .classList.add(
            "active-page"
          );


        pageTitle.textContent =
          pageInfo[
            targetPage
          ].title;


        pageDescription.textContent =
          pageInfo[
            targetPage
          ].description;


        

          // Memuat ulang data stok
        if (
            targetPage === "stok"
        ) {

            tampilkanStokHP();

        }

        if (
            targetPage === "history"
        ) {

            tampilkanHistoryHP();

        }

        if (
            targetPage === "rekap"
        ) {

            tampilkanRekap();

        }

        if (
            targetPage === "stok"
        ) {

            tampilkanStokHP();

        }

        if (
            window.innerWidth <= 768
        ) {

            tutupMenuMobile();

        }

      }
    );

  }
);


// ================================
// PINDAH KE HALAMAN TAMBAH
// ================================

document
  .getElementById("goTambah")
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(
          '[data-page="tambah"]'
        )
        .click();

    }
  );

// =================================
// PREVIEW FOTO TAMBAH HP
// =================================

const inputKamera =
  document.getElementById(
    "kameraHP"
  );


const inputFile =
  document.getElementById(
    "fotoHP"
  );


const fotoPreview =
  document.getElementById(
    "fotoPreview"
  );


let fotoTerpilih = null;


// Fungsi menampilkan foto

function tampilkanPreviewFoto(
  file
) {

  // Jika belum ada foto

  if (!file) {

    return;

  }


  // Pastikan file adalah gambar

  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    alert(
      "File yang dipilih harus berupa gambar."
    );

    return;

  }


  // Simpan foto yang dipilih

  fotoTerpilih = file;


  // Baca foto

  const reader =
    new FileReader();


  reader.onload =
    function (event) {

      fotoPreview.innerHTML = `
      
        <img
          src="${event.target.result}"
          alt="Preview HP"
        >

      `;

    };


  reader.readAsDataURL(
    file
  );

}


// =================================
// FOTO DARI KAMERA
// =================================

inputKamera.addEventListener(
  "change",
  function () {

    const file =
      inputKamera.files[0];


    tampilkanPreviewFoto(
      file
    );

  }
);


// =================================
// FOTO DARI FILE
// =================================

inputFile.addEventListener(
  "change",
  function () {

    const file =
      inputFile.files[0];


    tampilkanPreviewFoto(
      file
    );

  }
);


// ================================
// HITUNG TOTAL HPP
// ================================

const hargaBeli =
  document.getElementById(
    "hargaBeli"
  );

const biayaReparasi =
  document.getElementById(
    "biayaReparasi"
  );

const biayaLain =
  document.getElementById(
    "biayaLain"
  );

const totalHPP =
  document.getElementById(
    "totalHPP"
  );


function formatRupiah(
  angka
) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(angka);

}


function hitungHPP() {

  const beli =
    Number(
      hargaBeli.value
    ) || 0;


  const reparasi =
    Number(
      biayaReparasi.value
    ) || 0;


  const lain =
    Number(
      biayaLain.value
    ) || 0;


  const total =
    beli +
    reparasi +
    lain;


  totalHPP.textContent =
    formatRupiah(total);

}


hargaBeli.addEventListener(
  "input",
  hitungHPP
);


biayaReparasi.addEventListener(
  "input",
  hitungHPP
);


biayaLain.addEventListener(
  "input",
  hitungHPP
);


// ================================
// SIMPAN DATA HP KE API
// ================================

const formTambahHP =
  document.getElementById(
    "formTambahHP"
  );


formTambahHP.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    // Mengambil data dari form
    const nama =
      document
        .getElementById("namaHP")
        .value
        .trim();


    const file =
      document
        .getElementById("fotoHP")
        .files[0];


    const harga =
      Number(
        document
          .getElementById("hargaBeli")
          .value
      );


    const reparasi =
      Number(
        document
          .getElementById(
            "biayaReparasi"
          ).value
      ) || 0;


    const lain =
      Number(
        document
          .getElementById(
            "biayaLain"
          ).value
      ) || 0;


    // Validasi
    if (!nama) {

      alert(
        "Nama atau seri HP wajib diisi."
      );

      return;

    }


    if (!file) {

      alert(
        "Foto HP wajib dipilih."
      );

      return;

    }


    if (harga <= 0) {

      alert(
        "Harga beli harus lebih dari Rp0."
      );

      return;

    }


    // Batas ukuran foto: 5 MB
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Ukuran foto terlalu besar. " +
        "Maksimal 5 MB."
      );

      return;

    }


    // Mengubah foto menjadi Base64
    const reader =
      new FileReader();


    reader.onload =
      async function () {

        try {

          // Mengambil Base64 tanpa bagian
          // data:image/...;base64,
          const fotoBase64 =
            reader.result
              .split(",")[1];


          // Data yang dikirim ke Apps Script
          const dataHP = {

            aksi:
              "tambahHP",

            namaHP:
              nama,

            hargaBeli:
              harga,

            biayaReparasi:
              reparasi,

            biayaLain:
              lain,

            fotoBase64:
              fotoBase64,

            tipeFoto:
              file.type,

            namaFoto:
              file.name

          };


          // Mengubah tombol saat proses
          const tombolSimpan =
            formTambahHP
              .querySelector(
                'button[type="submit"]'
              );


          tombolSimpan.disabled =
            true;


          tombolSimpan.textContent =
            "Menyimpan...";


          // Mengirim data ke Apps Script
          await fetch(
            API_URL,
            {

              method:
                "POST",

              mode:
                "no-cors",

              headers: {
                "Content-Type":
                  "text/plain"
              },

              body:
                JSON.stringify(
                  dataHP
                )

            }
          );


          alert(
            "Data HP sedang diproses. " +
            "Silakan cek Spreadsheet " +
            "dan Google Drive."
          );


          // Mengosongkan form
          formTambahHP.reset();

          fotoTerpilih = null;

            inputKamera.value = "";

            inputFile.value = "";


          // Kembalikan tampilan preview
  // seperti kondisi awal

  fotoPreview.innerHTML = `
  
    <span>📷</span>

    <p>
      Preview foto akan muncul di sini
    </p>

  `;


          // Mengembalikan HPP
          totalHPP.textContent =
            "Rp0";


        } catch (error) {

          console.error(
            error
          );


          alert(
            "Gagal mengirim data. " +
            "Periksa URL API dan koneksi."
          );

        } finally {

          const tombolSimpan =
            formTambahHP
              .querySelector(
                'button[type="submit"]'
              );


          tombolSimpan.disabled =
            false;


          tombolSimpan.textContent =
            "Simpan HP";

        }

      };


    reader.readAsDataURL(
      file
    );

  }
);

// =================================
// AMBIL DAN TAMPILKAN STOK HP
// =================================

async function tampilkanStokHP() {

  const stokContainer =
    document.getElementById(
      "stokContainer"
    );


  // Tampilan saat data sedang dimuat
  stokContainer.innerHTML = `
    <div class="empty-state">

      <span>⏳</span>

      <h3>
        Memuat data HP...
      </h3>

      <p>
        Mengambil data dari database.
      </p>

    </div>
  `;


  try {

    // Mengambil data dari Apps Script
    const response =
      await fetch(
        `${API_URL}?aksi=ambilHP`
      );


    const hasil =
      await response.json();


    // Jika API gagal
    if (!hasil.sukses) {

      throw new Error(
        hasil.pesan
      );

    }


    daftarHP =
  hasil.data;


    // Jika belum ada HP
    if (
      daftarHP.length === 0
    ) {

      stokContainer.innerHTML = `
        <div class="empty-state">

          <span>📱</span>

          <h3>
            Belum ada data HP
          </h3>

          <p>
            Tambahkan HP pertama
            melalui menu Tambah HP.
          </p>

        </div>
      `;

      return;

    }


    // Hanya menampilkan HP
    // dengan status Tersedia
    const stokTersedia =
      daftarHP.filter(
        function (hp) {

          return (
            hp.status ===
            "Tersedia"
          );

        }
      );


    // Jika semua HP sudah terjual
    if (
      stokTersedia.length === 0
    ) {

      stokContainer.innerHTML = `
        <div class="empty-state">

          <span>📦</span>

          <h3>
            Stok sedang kosong
          </h3>

          <p>
            Semua HP sudah terjual.
          </p>

        </div>
      `;

      return;

    }


    // Membuat kartu untuk setiap HP
    stokContainer.innerHTML =
      stokTersedia
        .map(
          function (hp) {

            // Membuat URL foto
            const fotoURL =
              `https://drive.google.com/thumbnail?id=${hp.fotoID}&sz=w1000`;


            return `

              <article class="product-card">

                <div class="product-image">

                  <img
                    src="${fotoURL}"
                    alt="${hp.namaHP}"
                    loading="lazy"
                  >

                </div>


                <div class="product-content">

                  <div class="product-title-row">

                    <h3>
                      ${hp.namaHP}
                    </h3>

                    <span class="status-badge">

                      ● Tersedia

                    </span>

                  </div>


                  <div class="price-list">

                    <div>

                      <span>
                        Harga Beli
                      </span>

                      <strong>
                        ${formatRupiah(
                          hp.hargaBeli
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Biaya Reparasi
                      </span>

                      <strong>
                        ${formatRupiah(
                          hp.biayaReparasi
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Biaya Lain
                      </span>

                      <strong>
                        ${formatRupiah(
                          hp.biayaLain
                        )}
                      </strong>

                    </div>

                  </div>


                  <div class="hpp-product">

                    <span>
                      Total HPP
                    </span>

                    <strong>
                      ${formatRupiah(
                        hp.totalHPP
                      )}
                    </strong>

                  </div>

<button
  class="btn-edit"
  onclick="bukaEditHP('${hp.id}')"
>
  ✏️ Edit Biaya
</button>

                  <button
  class="btn-jual"
  onclick="tandaiTerjual(
    '${hp.id}',
    '${hp.namaHP}',
    ${hp.totalHPP}
  )"
>
  Tandai Terjual
</button>

                </div>

              </article>

            `;

          }
        )
        .join("");


  } catch (error) {

    console.error(
      "Gagal mengambil stok:",
      error
    );


    stokContainer.innerHTML = `

      <div class="empty-state">

        <span>⚠️</span>

        <h3>
          Data gagal dimuat
        </h3>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

}

// Menampilkan stok ketika
// website pertama kali dibuka

tampilkanStokHP();

async function tandaiTerjual(idHP, namaHP, totalHPP) {

  const inputHarga = prompt(
    `Masukkan harga jual untuk ${namaHP}:`
  );

  // Jika pengguna menekan Cancel
  if (inputHarga === null) {
    return;
  }

  // Menghapus titik, koma, Rp, dan karakter lain
  const hargaJual = Number(
    inputHarga.replace(/\D/g, "")
  );

  // Validasi harga
  if (
    !hargaJual ||
    hargaJual <= 0
  ) {
    alert(
      "Harga jual harus berupa angka yang lebih dari 0."
    );

    return;
  }

  const keuntungan =
    hargaJual - totalHPP;

  const konfirmasi = confirm(
    `HP: ${namaHP}\n\n` +
    `Harga Jual: ${formatRupiah(hargaJual)}\n` +
    `Total HPP: ${formatRupiah(totalHPP)}\n` +
    `Keuntungan: ${formatRupiah(keuntungan)}\n\n` +
    `Yakin ingin menandai HP ini sebagai terjual?`
  );

  if (!konfirmasi) {
    return;
  }

  try {

    const response = await fetch(
      API_URL,
      {
        method: "POST",

        body: JSON.stringify({
          aksi: "jualHP",

          id: idHP,

          hargaJual: hargaJual
        })
      }
    );


    const hasil =
      await response.json();


    if (hasil.sukses) {

      alert(
        "HP berhasil ditandai sebagai terjual!\n\n" +
        "Keuntungan: " +
        formatRupiah(
          hasil.keuntungan
        )
      );

      // Memuat ulang data stok
      tampilkanStokHP();

    } else {

      alert(
        "Gagal: " +
        hasil.pesan
      );

    }

  } catch (error) {

    console.error(error);

    alert(
      "Terjadi kesalahan saat menghubungkan ke server."
    );

  }

}

// =================================
// AMBIL DAN TAMPILKAN HISTORY
// =================================

async function tampilkanHistoryHP() {

  const historyContainer =
    document.getElementById(
      "historyContainer"
    );


  historyContainer.innerHTML = `
    <div class="empty-state">

      <span>⏳</span>

      <h3>
        Memuat history...
      </h3>

      <p>
        Mengambil data penjualan.
      </p>

    </div>
  `;


  try {

    const response =
      await fetch(
        `${API_URL}?aksi=ambilHP`
      );


    const hasil =
      await response.json();


    if (!hasil.sukses) {

      throw new Error(
        hasil.pesan
      );

    }


    // Hanya mengambil HP
    // yang sudah terjual
    const daftarTerjual =
      hasil.data.filter(
        function (hp) {

          return (
            hp.status ===
            "Terjual"
          );

        }
      );


    // Jika belum ada penjualan
    if (
      daftarTerjual.length === 0
    ) {

      historyContainer.innerHTML = `

        <div class="empty-state">

          <span>🧾</span>

          <h3>
            Belum ada riwayat
          </h3>

          <p>
            Belum ada HP yang terjual.
          </p>

        </div>

      `;

      return;

    }


    // Urutkan dari yang
    // paling baru terjual
    daftarTerjual.sort(
      function (a, b) {

        return new Date(
          b.tanggalTerjual
        ) - new Date(
          a.tanggalTerjual
        );

      }
    );


    historyContainer.innerHTML =
      daftarTerjual
        .map(
          function (hp) {

            const fotoURL =
              `https://drive.google.com/thumbnail?id=${hp.fotoID}&sz=w1000`;


            const tanggal =
              formatTanggal(
                hp.tanggalTerjual
              );


            const kelasKeuntungan =
              hp.keuntungan >= 0
                ? "untung"
                : "rugi";


            const teksKeuntungan =
              hp.keuntungan >= 0
                ? "Keuntungan"
                : "Kerugian";


            return `

              <article
                class="product-card"
              >

                <div
                  class="product-image"
                >

                  <img
                    src="${fotoURL}"
                    alt="${hp.namaHP}"
                    loading="lazy"
                  >

                </div>


                <div
                  class="product-content"
                >

                  <div
                    class="product-title-row"
                  >

                    <h3>
                      ${hp.namaHP}
                    </h3>

                    <span
                      class="status-terjual"
                    >

                      ✓ Terjual

                    </span>

                  </div>


                  <div
                    class="price-list"
                  >

                    <div>

                      <span>
                        Total HPP
                      </span>

                      <strong>
                        ${formatRupiah(
                          hp.totalHPP
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Harga Jual
                      </span>

                      <strong>
                        ${formatRupiah(
                          hp.hargaJual
                        )}
                      </strong>

                    </div>

                  </div>


                  <div
                    class="
                      keuntungan-box
                      ${kelasKeuntungan}
                    "
                  >

                    <span>
                      ${teksKeuntungan}
                    </span>

                    <strong>
                      ${formatRupiah(
                        Math.abs(
                          hp.keuntungan
                        )
                      )}
                    </strong>

                  </div>


                  <div
                    class="tanggal-terjual"
                  >

                    📅 Terjual:

                    ${tanggal}

                  </div>

                </div>

              </article>

            `;

          }
        )
        .join("");


  } catch (error) {

    console.error(
      "Gagal memuat history:",
      error
    );


    historyContainer.innerHTML = `

      <div class="empty-state">

        <span>⚠️</span>

        <h3>
          History gagal dimuat
        </h3>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

}

// =================================
// FORMAT TANGGAL INDONESIA
// =================================

function formatTanggal(
  tanggal
) {

  if (!tanggal) {

    return "-";

  }


  const hasilTanggal =
    new Date(
      tanggal
    );


  if (
    isNaN(
      hasilTanggal
        .getTime()
    )
  ) {

    return "-";

  }


  return new Intl.DateTimeFormat(
    "id-ID",
    {

      day:
        "2-digit",

      month:
        "long",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit"

    }
  ).format(
    hasilTanggal
  );

}

// =================================
// REKAP KEUNTUNGAN BULANAN
// =================================

async function tampilkanRekap() {

  const inputBulan =
    document.getElementById(
      "pilihBulan"
    );


  // Mengambil bulan yang dipilih
  const bulanDipilih =
    inputBulan.value;


  const keuntunganElement =
    document.getElementById(
      "rekapKeuntungan"
    );


  const jumlahElement =
    document.getElementById(
      "rekapJumlahHP"
    );


  const omzetElement =
    document.getElementById(
      "rekapOmzet"
    );


  const hppElement =
    document.getElementById(
      "rekapHPP"
    );


  const tableBody =
    document.getElementById(
      "rekapTableBody"
    );


  tableBody.innerHTML = `

    <tr>

      <td
        colspan="5"
        class="table-empty"
      >

        Memuat data...

      </td>

    </tr>

  `;


  try {

    const response =
      await fetch(
        `${API_URL}?aksi=ambilHP`
      );


    const hasil =
      await response.json();


    if (!hasil.sukses) {

      throw new Error(
        hasil.pesan
      );

    }


    // Mengambil tahun dan bulan
    const [
      tahunDipilih,
      nomorBulan
    ] =
      bulanDipilih.split("-");


    // Mengambil HP yang terjual
    // pada bulan yang dipilih
    const dataBulan =
      hasil.data.filter(
        function (hp) {

          if (
            hp.status !==
            "Terjual"
          ) {

            return false;

          }


          const tanggal =
            new Date(
              hp.tanggalTerjual
            );


          const tahun =
            String(
              tanggal.getFullYear()
            );


          const bulan =
            String(
              tanggal.getMonth() + 1
            )
            .padStart(
              2,
              "0"
            );


          return (

            tahun ===
            tahunDipilih

            &&

            bulan ===
            nomorBulan

          );

        }
      );


    // Menghitung total
    const totalKeuntungan =
      dataBulan.reduce(
        function (
          total,
          hp
        ) {

          return (
            total +
            Number(
              hp.keuntungan
            )
          );

        },
        0
      );


    const totalOmzet =
      dataBulan.reduce(
        function (
          total,
          hp
        ) {

          return (
            total +
            Number(
              hp.hargaJual
            )
          );

        },
        0
      );


    const totalHPP =
      dataBulan.reduce(
        function (
          total,
          hp
        ) {

          return (
            total +
            Number(
              hp.totalHPP
            )
          );

        },
        0
      );


    // Menampilkan ringkasan
    keuntunganElement.textContent =
      formatRupiah(
        totalKeuntungan
      );


    jumlahElement.textContent =
      `${dataBulan.length} Unit`;


    omzetElement.textContent =
      formatRupiah(
        totalOmzet
      );


    hppElement.textContent =
      formatRupiah(
        totalHPP
      );


    // Judul bulan
    const namaBulan =
      new Intl.DateTimeFormat(
        "id-ID",
        {

          month:
            "long",

          year:
            "numeric"

        }
      )
      .format(
        new Date(
          `${bulanDipilih}-01`
        )
      );


    document
      .getElementById(
        "judulBulanRekap"
      )
      .textContent =
        `Penjualan ${namaBulan}`;


    // Jika tidak ada transaksi
    if (
      dataBulan.length === 0
    ) {

      tableBody.innerHTML = `

        <tr>

          <td
            colspan="5"
            class="table-empty"
          >

            Belum ada penjualan
            pada bulan ini.

          </td>

        </tr>

      `;

      return;

    }


    // Urutkan dari terbaru
    dataBulan.sort(
      function (
        a,
        b
      ) {

        return (
          new Date(
            b.tanggalTerjual
          )
          -
          new Date(
            a.tanggalTerjual
          )
        );

      }
    );


    // Menampilkan tabel
    tableBody.innerHTML =
      dataBulan
        .map(
          function (hp) {

            const kelas =
              Number(
                hp.keuntungan
              ) >= 0
                ? "profit"
                : "loss";


            return `

              <tr>

                <td>

                  ${formatTanggal(
                    hp.tanggalTerjual
                  )}

                </td>


                <td>

                  <strong>

                    ${hp.namaHP}

                  </strong>

                </td>


                <td>

                  ${formatRupiah(
                    hp.totalHPP
                  )}

                </td>


                <td>

                  ${formatRupiah(
                    hp.hargaJual
                  )}

                </td>


                <td>

                  <span
                    class="
                      keuntungan-label
                      ${kelas}
                    "
                  >

                    ${formatRupiah(
                      hp.keuntungan
                    )}

                  </span>

                </td>

              </tr>

            `;

          }
        )
        .join("");


  } catch (error) {

    console.error(
      error
    );


    tableBody.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="table-empty"
        >

          Gagal memuat data:
          ${error.message}

        </td>

      </tr>

    `;

  }

}

// =================================
// BULAN DEFAULT
// =================================

function aturBulanSekarang() {

  const sekarang =
    new Date();


  const tahun =
    sekarang.getFullYear();


  const bulan =
    String(
      sekarang.getMonth() + 1
    )
    .padStart(
      2,
      "0"
    );


  document
    .getElementById(
      "pilihBulan"
    )
    .value =
      `${tahun}-${bulan}`;

}
aturBulanSekarang();
document
  .getElementById(
    "pilihBulan"
  )
  .addEventListener(
    "change",
    tampilkanRekap
  );

// =================================
// DASHBOARD
// =================================

async function tampilkanDashboard() {

  const totalStokElement =
    document.getElementById(
      "totalStok"
    );


  const terjualElement =
    document.getElementById(
      "terjualBulanIni"
    );


  const keuntunganElement =
    document.getElementById(
      "keuntunganBulanIni"
    );


  // Tampilan saat data dimuat
  totalStokElement.textContent =
    "...";


  terjualElement.textContent =
    "...";


  keuntunganElement.textContent =
    "Memuat...";


  try {

    const response =
      await fetch(
        `${API_URL}?aksi=ambilHP`
      );


    const hasil =
      await response.json();


    if (!hasil.sukses) {

      throw new Error(
        hasil.pesan
      );

    }


    const semuaHP =
      hasil.data;


    // =============================
    // TOTAL STOK TERSEDIA
    // =============================

    const totalStok =
      semuaHP.filter(
        function (hp) {

          return (
            String(
              hp.status
            )
            .trim()
            .toLowerCase()
            ===
            "tersedia"
          );

        }
      ).length;


    // =============================
    // BULAN DAN TAHUN SEKARANG
    // =============================

    const sekarang =
      new Date();


    const bulanSekarang =
      sekarang.getMonth();


    const tahunSekarang =
      sekarang.getFullYear();


    // =============================
    // HP TERJUAL BULAN INI
    // =============================

    const penjualanBulanIni =
      semuaHP.filter(
        function (hp) {

          // Harus berstatus Terjual
          if (
            String(
              hp.status
            )
            .trim()
            .toLowerCase()
            !==
            "terjual"
          ) {

            return false;

          }


          // Harus memiliki tanggal terjual
          if (
            !hp.tanggalTerjual
          ) {

            return false;

          }


          const tanggalTerjual =
            new Date(
              hp.tanggalTerjual
            );


          // Lewati tanggal tidak valid
          if (
            isNaN(
              tanggalTerjual.getTime()
            )
          ) {

            return false;

          }


          return (

            tanggalTerjual
              .getMonth()
            ===
            bulanSekarang

            &&

            tanggalTerjual
              .getFullYear()
            ===
            tahunSekarang

          );

        }
      );


    // =============================
    // TOTAL KEUNTUNGAN BULAN INI
    // =============================

    const keuntunganBulanIni =
      penjualanBulanIni.reduce(
        function (
          total,
          hp
        ) {

          return (
            total +
            Number(
              hp.keuntungan
            )
          );

        },
        0
      );


    // =============================
    // TAMPILKAN KE DASHBOARD
    // =============================

    totalStokElement.textContent =
      totalStok;


    terjualElement.textContent =
      penjualanBulanIni.length;


    keuntunganElement.textContent =
      formatRupiah(
        keuntunganBulanIni
      );


  } catch (error) {

    console.error(
      "Dashboard gagal dimuat:",
      error
    );


    totalStokElement.textContent =
      "-";


    terjualElement.textContent =
      "-";


    keuntunganElement.textContent =
      "Gagal";

  }

}
aturBulanSekarang();
tampilkanDashboard();
// =================================
// MENU MOBILE
// =================================

const menuToggle =
  document.getElementById(
    "menuToggle"
  );


const sidebar =
  document.querySelector(
    ".sidebar"
  );


const sidebarOverlay =
  document.getElementById(
    "sidebarOverlay"
  );


function bukaMenuMobile() {

  sidebar.classList.add(
    "active"
  );


  sidebarOverlay.classList.add(
    "active"
  );

}


function tutupMenuMobile() {

  sidebar.classList.remove(
    "active"
  );


  sidebarOverlay.classList.remove(
    "active"
  );

}


menuToggle.addEventListener(
  "click",
  bukaMenuMobile
);


sidebarOverlay.addEventListener(
  "click",
  tutupMenuMobile
);

// =================================
// MEMBUKA HALAMAN
// =================================

function bukaHalaman(
  namaHalaman
) {

  // Menyembunyikan semua halaman

  pages.forEach(
    function (page) {

      page.classList.remove(
        "active-page"
      );

    }
  );


  // Menampilkan halaman tujuan

  document
    .getElementById(
      namaHalaman
    )
    .classList.add(
      "active-page"
    );


  // Mengubah judul header

  if (
    namaHalaman === "edit"
  ) {

    pageTitle.textContent =
      "Edit Data HP";


    pageDescription.textContent =
      "Perbarui biaya dan total HPP HP";

  }

}

// =================================
// EDIT DATA HP
// =================================

let dataHPEdit = null;


function bukaEditHP(
  idHP
) {

  // Cari data HP berdasarkan ID

  dataHPEdit =
    daftarHP.find(
      function (hp) {

        return (
          String(
            hp.id
          )
          ===
          String(
            idHP
          )
        );

      }
    );


  // Jika data tidak ditemukan

  if (
    !dataHPEdit
  ) {

    alert(
      "Data HP tidak ditemukan."
    );

    return;

  }


  // Mengisi ID HP

  document
    .getElementById(
      "editIdHP"
    )
    .value =
    dataHPEdit.id;


  // Mengisi nama HP

  document
    .getElementById(
      "editNamaHP"
    )
    .value =
    dataHPEdit.namaHP;


  // Mengisi harga beli

  document
    .getElementById(
      "editHargaBeli"
    )
    .value =
    Number(
      dataHPEdit.hargaBeli
    ) || 0;


  // Mengisi biaya reparasi

  document
    .getElementById(
      "editBiayaReparasi"
    )
    .value =
    Number(
      dataHPEdit.biayaReparasi
    ) || 0;


  // Mengisi biaya lain

  document
    .getElementById(
      "editBiayaLain"
    )
    .value =
    Number(
      dataHPEdit.biayaLain
    ) || 0;


  // Menghitung HPP

  hitungHPPEdit();


  // Membuka halaman edit

  bukaHalaman(
    "edit"
  );

}

function hitungHPPEdit() {

  const hargaBeli =
    Number(
      document.getElementById(
        "editHargaBeli"
      ).value
    ) || 0;


  const biayaReparasi =
    Number(
      document.getElementById(
        "editBiayaReparasi"
      ).value
    ) || 0;


  const biayaLain =
    Number(
      document.getElementById(
        "editBiayaLain"
      ).value
    ) || 0;


  const totalHPP =
    hargaBeli +
    biayaReparasi +
    biayaLain;


  document.getElementById(
    "editTotalHPP"
  ).textContent =
    formatRupiah(
      totalHPP
    );

}

[
  "editHargaBeli",
  "editBiayaReparasi",
  "editBiayaLain"
].forEach(
  function (id) {

    document
      .getElementById(id)
      .addEventListener(
        "input",
        hitungHPPEdit
      );

  }
);

// =================================
// SIMPAN PERUBAHAN DATA HP
// =================================

const formEditHP =
  document.getElementById(
    "formEditHP"
  );


formEditHP.addEventListener(
  "submit",
  async function (event) {

    // Mencegah halaman refresh

    event.preventDefault();


    // Mengambil data dari form

    const idHP =
      document
        .getElementById(
          "editIdHP"
        )
        .value;


    const namaHP =
      document
        .getElementById(
          "editNamaHP"
        )
        .value
        .trim();


    const hargaBeli =
      Number(
        document
          .getElementById(
            "editHargaBeli"
          )
          .value
      );


    const biayaReparasi =
      Number(
        document
          .getElementById(
            "editBiayaReparasi"
          )
          .value
      ) || 0;


    const biayaLain =
      Number(
        document
          .getElementById(
            "editBiayaLain"
          )
          .value
      ) || 0;


    // Validasi

    if (
      !namaHP
    ) {

      alert(
        "Nama HP tidak boleh kosong."
      );

      return;

    }


    if (
      hargaBeli <= 0
    ) {

      alert(
        "Harga beli harus lebih dari Rp0."
      );

      return;

    }


    // Hitung HPP baru

    const totalHPP =
      hargaBeli +
      biayaReparasi +
      biayaLain;


    // Konfirmasi sebelum menyimpan

    const yakin =
      confirm(

        "Simpan perubahan data HP?\n\n" +

        "Nama HP: " +
        namaHP +

        "\nTotal HPP Baru: " +
        formatRupiah(
          totalHPP
        )

      );


    if (
      !yakin
    ) {

      return;

    }


    // Tombol simpan

    const tombolSimpan =
      formEditHP.querySelector(
        'button[type="submit"]'
      );


    tombolSimpan.disabled =
      true;


    tombolSimpan.textContent =
      "Menyimpan...";


    try {

      // Mengirim data ke Apps Script

      const response =
        await fetch(
          API_URL,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "text/plain"

            },

            body:
              JSON.stringify({

                aksi:
                  "editHP",

                id:
                  idHP,

                namaHP:
                  namaHP,

                hargaBeli:
                  hargaBeli,

                biayaReparasi:
                  biayaReparasi,

                biayaLain:
                  biayaLain,

                totalHPP:
                  totalHPP

              })

          }
        );


      const hasil =
        await response.json();


      // Jika berhasil

      if (
        hasil.sukses
      ) {

        alert(
          "Data HP berhasil diperbarui."
        );


        // Memuat ulang data stok

        await tampilkanStokHP();


        // Kembali ke halaman stok

        document
          .querySelector(
            '[data-page="stok"]'
          )
          .click();

      }

      else {

        alert(
          "Gagal: " +
          hasil.pesan
        );

      }

    }

    catch (
      error
    ) {

      console.error(
        error
      );


      alert(
        "Gagal menghubungkan ke server."
      );

    }

    finally {

      tombolSimpan.disabled =
        false;


      tombolSimpan.textContent =
        "💾 Simpan Perubahan";

    }

  }
);

// =================================
// BATAL EDIT
// =================================

document
  .getElementById(
    "batalEdit"
  )
  .addEventListener(
    "click",
    function () {

      // Kembali ke halaman stok

      document
        .querySelector(
          '[data-page="stok"]'
        )
        .click();

    }
  );