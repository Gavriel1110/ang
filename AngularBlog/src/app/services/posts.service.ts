import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage:AngularFireStorage,
    private afs: AngularFirestore,
    private toastr:ToastrService,
    private router:Router
  ) { }


  uploadImage(selectedImage,postData,formStatus,id){ 
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);


    this.storage.upload(filePath,selectedImage).then(()=>{
      console.log('post image uploaded successfully');

      this.storage.ref(filePath).getDownloadURL().subscribe(URL=>{
        //console.log(URL);
        postData.postImgPath = URL;
        console.log(postData);

         if(formStatus == 'Edit'){
          this.updateData(id,postData);
         }else{
          
         }
        this.saveData(postData);

      })

    })
  }
  saveData(postData){
    this.afs.collection('posts').add(postData).then(docRef=> {
      
      this.toastr.success('data Insert Successfully..!');
      this.router.navigate(['/posts']);
    })
    
  }
loadData(): Observable<any> {
  return this.afs.collection('posts').snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      });
    })
  );
}

loadOneData(id: string): Observable<any> {
  return this.afs.doc(`posts/${id}`).valueChanges();
}
updateData(id: string, postData: any) {
  this.afs.doc(`posts/${id}`).update(postData).then(() => {
    this.toastr.success('Data updated successfully!');
    this.router.navigate(['/posts']);
  });
}


deleteImage(postImgPath: string, id: string): void {
  let ref;

  if (postImgPath.startsWith('http')) {
    ref = this.storage.storage.refFromURL(postImgPath); // URL מלא
  } else {
    ref = this.storage.ref(postImgPath); // child path
  }

  ref.delete().then(() => {
    this.deleteData(id);
    this.toastr.success('Post deleted successfully!');
  }).catch((error) => {
    console.error('❌ Error deleting image:', error);
    this.toastr.error('Failed to delete image.');
  });
}

deleteData(id) {
  this.afs.doc(`posts/${id}`).delete().then(() => {
    this.toastr.success('Data deleted .....!');
  });
}}
