import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {elementAt} from "rxjs";
import {ProductService} from "../services/product.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit{
  productFormGroup! : FormGroup;
 constructor( private fb : FormBuilder, public prodService : ProductService, private  router : Router) {
 }
 ngOnInit() {
 this.productFormGroup = this.fb.group({
   name : this.fb.control(null, [Validators.required, Validators.minLength(4)]),
   price : this.fb.control(0, [Validators.required, Validators.min(200)]),
   promotion : this.fb.control(false, [Validators.required]),
 });
 }

  handleAddProduct() {
  let product = this.productFormGroup.value;
  this.prodService.addNewProduct(product).subscribe({
    next : (data)=>{
  alert("product added successfully, add other product?");
  this.productFormGroup.reset();


    },
    error : err =>{console.log(err);}

  })
  }

}
