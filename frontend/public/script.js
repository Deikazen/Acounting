


console.log("link : ",apiBaseUrl);





let items ;

 fetch(`${apiBaseUrl}/user/login`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error fetching data:', error));

    console.log("link : ",apiBaseUrl);

const NAVBAR = document.getElementById("main-navbar");

function showRegister() {
    document.getElementById('login-page').classList.add('d-none');
    document.getElementById('register-page').classList.remove('d-none');
    document.getElementById('main-navbar').classList.add('d-none');
    document.getElementById('home-page').classList.add('d-none');
}
function showLogin() {
    document.getElementById('register-page').classList.add('d-none');
    document.getElementById('login-page').classList.remove('d-none');
    document.getElementById('main-navbar').classList.add('d-none');
    document.getElementById('home-page').classList.add('d-none');


}
function showHomePage() {
    document.getElementById('login-page').classList.add('d-none');
    document.getElementById('register-page').classList.add('d-none');

    console.log("showHomepage function dipanggil")
    document.getElementById('home-page').classList.remove('d-none');

    console.log("menampilan home page dari function showHompage");
    document.getElementById('home-button').classList.remove('d-none');

    document.getElementById("main-navbar").classList.remove("d-none");
    
    console.log("fecth balance dipanggil dari function showHomePage"); // debuggggggggggggggggggggggggggggggggggg
    fetchBalance();
}
function logout() {
    document.getElementById('home-page').classList.add('d-none');
    document.getElementById('login-page').classList.remove('d-none');
    document.getElementById('main-navbar').classList.add('d-none');

}
function showNotification(message, type = 'success') {
    const notif = document.getElementById("notification");
    notif.textContent = message;
    
 
    notif.classList.remove("alert-success", "alert-danger", "alert-info", "d-none");
    
   
    if(type === "success"){
      notif.classList.add("notif-success");
    } else if(type === "error"){
      notif.classList.add("notif-error");
    } else {
      notif.classList.add("notif-info");
    }

    notif.classList.remove("d-none");
    notif.classList.add("show");
  

    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(()=>{
        notif.classList.add("d-none");
      })
    }, 3700);
  }


function updateBalanceDisplay() {
    const balanceElement = document.getElementById("current-balance");
    balanceElement.textContent = `Rp${currentBalance.toLocaleString("id-ID")}`;

    if(currentBalance >= 0){
        balanceElement.classList.remove("text-danger");
        balanceElement.classList.add("text-success");
    } else {
        balanceElement.classList.remove("text-success");
        balanceElement.classList.add("text-danger");
    }
}
function displayTransactionHistory(items) {
    const transactionList = document.getElementById("transaction-list");
    transactionList.innerHTML = ""; // Kosongkan daftar sebelumnya

    items.forEach(item => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");

    // Format item transaksi
    listItem.innerHTML = `
         <div>
            <strong>${item.category}</strong> (${item.type})<br>
            Jumlah: Rp${Number(item.amount).toLocaleString("id-ID")}<br>
            Deskripsi: ${item.description || "-"}<br>
            Tanggal: ${new Date(item.date).toLocaleDateString("id-ID")}
         </div>
        <div>
            <button class="btn btn-primary btn-sm update-button" data-id="${item._id}">Update</button>
            <button class="btn btn-danger btn-sm delete-button" data-id="${item._id}">Hapus</button>
        </div>
    `;

        transactionList.appendChild(listItem);
    });
    

    document.getElementById("transaction-list").addEventListener("click", function(event) {
        if (event.target.classList.contains("update-button")) {
            handleUpdate(event);
        }
    });
    

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", handleDelete);
    });

}

function showSPinner(){
    document.getElementById('loading').style.display = 'block';
}

function hideSpinner(){
    document.getElementById('loading').style.display = 'none';
}


let currentBalance = 1000 ;
async function fetchBalance() {
    showSPinner();
    console.log("fetch balance dipagnggil dari auth"); /// debuggggggggggggggggggggggggggggggggggggggggggggggggggggg
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${apiBaseUrl}/protected/get`, {
            method:"GET",
            headers:{"Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("API response items : ",data.items); // Menampilkan data di console debugggg
        if(response.ok){
            currentBalance = data.totalBalance;
            updateBalanceDisplay();

            items = data.items;
            displayTransactionHistory(data.items);
        } else {
            console.error("Gagal mengambil saldo :", data.message);
        }
    } catch(error) {
        console.error("Error : ", error);
    }
    hideSpinner();
}




const updateModalElement = document.getElementById("update-modal"); // dibuat secara globallllllll
const updateModal = new bootstrap.Modal(updateModalElement);


function handleUpdate(event) {
    showSPinner();
    console.log("handleUpdate dipanggil!", event); // debugging=====================================

    const transactionId = event.target.dataset.id; // Ambil ID transaksi dari atribut data-id
    const transaction = items.find(items => items._id === transactionId); // Cari transaksi berdasarkan ID


    // Isi form dengan data transaksi
    document.getElementById("update-amount").value = transaction.amount;
    document.getElementById("update-type").value = transaction.type;
    document.getElementById("update-category").value = transaction.category;
    document.getElementById("update-description").value = transaction.description || "";
    document.getElementById("transaction-id").value = transactionId; // Simpan ID transaksi

    // Tampilkan modal form update
    
    updateModal.show(); // Tampilkan modal
    hideSpinner();
}

function handleDelete(event) {
    showSPinner();
    console.log("Tombol delete ditekan", event); // debugging ================
    const transactionId = event.target.dataset.id; // Ambil ID transaksi dari atribut data-id


     // Simpan transactionId di data attribute modal
     const deleteModalElement = document.getElementById("deleteModal");
     deleteModalElement.dataset.transactionId = transactionId;

     // Tampilkan modal konfirmasi
    const deleteModal = new bootstrap.Modal(deleteModalElement);
    deleteModal.show();
    hideSpinner();
}

function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    // Ditambahkan: cek tipe input dan ubah sesuai
    if (input.type === "password") {
      input.type = "text";
      toggleElement.innerHTML = '<i class="bi bi-eye"></i>';
    } else {
      input.type = "password";
      toggleElement.innerHTML = '<i class="bi bi-eye-slash"></i>';
    }
  }



// Kirim data  ke backend
document.getElementById("update-form").addEventListener("submit", async function(event) {
    showSPinner();
event.preventDefault();

const transactionId = document.getElementById("transaction-id").value; // Ambil ID transaksi
const updatedData = {
    amount: parseFloat(document.getElementById("update-amount").value),
    type: document.getElementById("update-type").value,
    category: document.getElementById("update-category").value,
    description: document.getElementById("update-description").value,
    date: new Date().toISOString()
};

try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${apiBaseUrl}/protected/update/${transactionId}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
    });

    if (response.ok) {
        showNotification("Transaksi berhasil diupdate!", "success");
        await fetchBalance(); // Perbarui saldo dan riwayat transaksi
        const modal = bootstrap.Modal.getInstance(document.getElementById("update-modal"));
        modal.hide(); // Sembunyikan modal setelah selesai
    } else {
        const data = await response.json();
        showNotification("Gagal update transaksi: " + data.message, "error");
    }
} catch (error) {
console.error("Error update transaksi:", error);
}   
hideSpinner();
});    




document.getElementById("register-form").addEventListener("submit", async function(event) {
    showSPinner();
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    
    const response = await fetch(`${apiBaseUrl}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    console.log(data); // debugging =======================
    if (response.ok) {
        showNotification("Registrasi berhasil! Silakan login.", "success");
        showLogin();
    } else {
        if (data.error === "INVALID_EMAIL"){
            showNotification("format email salah! ", "error");
        } else if (data.error === "EMAIL_ALREADY_REGISTERED") {
            showNotification("Email sudah terdaftar!","error");
        } else {
            showNotification("Registarsi gagal : " + data.msg, "error" );
        }

        }
    hideSpinner();
});    

document.getElementById("login-form").addEventListener("submit", async function(event) {
    showSPinner();
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
try {    
    const response = await fetch(`${apiBaseUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    
    const data = await response.json();
    if (response.ok) {
        const token = data.token;
        localStorage.setItem("authToken", token);
        showNotification(`Login berhasil Selamat Datang ${data.username} !` , "success");
        document.getElementById("login-page").classList.add("d-none");
        document.getElementById("home-page").classList.remove("d-none");
        document.getElementById('main-navbar').classList.remove('d-none');
        console.log("tokennya : ", token); // DEBUGGING =======================


        fetchBalance();
        console.log("fetch balance dipanggil dari login-form "); // debugggggggggggggggg
    } else {
        if (data.error === "EMAIL_NOT_FOUND") { // changed
            showNotification("Email tidak ditemukan!", "error"); // changed
        } else if (data.error === "INVALID_PASSWORD") { // changed
            showNotification("Password salah!", "error"); // changed
        } else {
            showNotification("Login gagal: " + data.msg, "error"); // changed
        }
    }
    hideSpinner();
} catch (error) {
    
    showNotification("Terjadi kesalahan saat menghubungi server." + error.message, "error");
}

});


document.getElementById("type").addEventListener("change", function() {
const type = this.value; // Ambil nilai type (income atau expense)
const category = document.getElementById("category"); // Ambil elemen dropdown kategori
category.innerHTML = "";

const options = type === "income"
    ? ["Gaji", "Bonus", "Pendapatan Investasi", "Hasil Penjualan", "Hadiah", "Lain-lain"]
    : ["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Pendidikan", "Lain-lain"];

    console.log({                      // debugggggggggggggggggggggggggggggggg
        amount,
        type,
        category,
        description
      });
      
console.log("Nilai type:", document.getElementById("type").value); // debuggggggggggggggggggggggggggggggggggggg



options.forEach(opt => {
    const optionElement = document.createElement("option");
    optionElement.value = opt.toLowerCase(); // Nilai opsi (lowercase)
    optionElement.textContent = opt; // Teks yang ditampilkan
    category.appendChild(optionElement);
});
});

document.getElementById("update-type").addEventListener("change", function() {
    const type = this.value; // Ambil nilai tipe dari modal update
    const category = document.getElementById("update-category"); // Ambil elemen dropdown kategori di modal update
    category.innerHTML = "";

    const options = type === "income"
        ? ["Gaji", "Bonus", "Pendapatan Investasi", "Hasil Penjualan", "Hadiah", "Lain-lain"]
        : ["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Pendidikan", "Lain-lain"];

    options.forEach(opt => {
        const optionElement = document.createElement("option");
        optionElement.value = opt.toLowerCase();
        optionElement.textContent = opt;
        category.appendChild(optionElement);
    });
});




document.getElementById("finance-form").addEventListener("submit", async function(event) {
    showSPinner();
event.preventDefault();
const amountRaw = document.getElementById("amount").dataset.rawValue;
const amount = parseFloat(amountRaw);
const type = document.getElementById("type").value;
const category = document.getElementById("category").value;
const description = document.getElementById("description").value;


if (isNaN(amount) || amount <= 0) {
    alert("Masukkan jumlah yang valid!"); // kecuali ini cooy
    return;
}

const token = localStorage.getItem("authToken");

try {
    const response = await fetch(`${apiBaseUrl}/protected/post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Tambahkan token ke Authorization header
        },
        body: JSON.stringify({ amount, type, category, description })
}); 

if (response.ok) {
    showNotification("Transaksi berhasil dicatat!", "success");
    await fetchBalance(); // Ambil saldo terbaru dari backend
    document.getElementById("finance-form").reset();
} else {
    const data = await response.json();
    showNotification("Gagal mencatat transaksi: " + (data.message || "Kesalahan tidak diketahui."), "error");
}
} catch (error) {
console.error("Gagal mengirim transaksi ke backend:", error);
showNotification("Terjadi kesalahan saat menghubungi server / Masukkan Type.", "error");
}
hideSpinner();
});

document.getElementById("amount").addEventListener("input", function(event) {
// Ambil nilai input tanpa karakter selain angka
let rawValue = event.target.value.replace(/\D/g, "");
event.target.dataset.rawValue = rawValue;

// Format angka dengan titik
// let formattedValue = new Intl.NumberFormat("id-ID").format(rawValue);

// Tampilkan hasil yang diformat di input
event.target.value = formattedValue;
});

document.getElementById("confirmDelete").addEventListener("click", async function() {
    const deleteModalElement = document.getElementById("deleteModal");
    const transactionId = deleteModalElement.dataset.transactionId;
    // Di dalam event listener konfirmasi delete
    const listItem = document.querySelector(`button[data-id="${transactionId}"]`).closest("li");
    listItem.remove();

    
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${apiBaseUrl}/protected/delete/${transactionId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.message) {
            showNotification("Transaksi berhasil dihapus!", "success");
            // Perbarui tampilan saldo dan riwayat transaksi
            await fetchBalance();
            document.getElementById("finance-form").reset();
        } else {
            showNotification("Gagal menghapus transaksi", "error");
        }
    } catch (error) {
        console.error("Error menghapus transaksi:", error);
        showNotification("Terjadi kesalahan saat menghapus transaksi.", "error");
    }
    
    // Sembunyikan modal konfirmasi
    const deleteModal = bootstrap.Modal.getInstance(deleteModalElement);
    deleteModal.hide();
});

document.getElementById("cancelDelete").addEventListener("click", function(){
    const deleteModalElement = document.getElementById("deleteModal");
    const deleteModal = bootstrap.Modal.getInstance(deleteModalElement);
    deleteModal.hide();
});

document.getElementById("cancelUpdate").addEventListener("click", function() {
    document.getElementById("update-form").reset();
    updateModal.hide();
});

document.getElementById("deleteModal").addEventListener("hidden.bs.modal", function () {
    // Cari semua elemen backdrop dan hapus
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
        backdrop.parentNode.removeChild(backdrop);
    });
});










  

