import { Product } from './../model/product.model';
import { ProductService } from './../services/product.service';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable, of} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements  OnInit{

  public products! : Array<Product>;
  currentPage : number = 0;
  pageSize : number = 10;
  totalPages : number = 0;
  errorMessage! : string;
  searchFormGroup! : FormGroup; // to use it i need to inject FormBuilder
  currentAction : string = "all";


  constructor( private productService : ProductService, private  fb : FormBuilder,
               public authService : AuthenticationService,private router : Router){ // injection of  services
  }

  ngOnInit( ) : void  {

       // using method get all service to print all products
      this.searchFormGroup = this.fb.group({
        keyword : this.fb.control(null)
      });
    this.handleGetPageProduct();

    }

  handleGetPageProduct(){
    this.productService.getPageProducts(this.currentPage, this.pageSize) .subscribe(
      {
        next : (data) =>{ this.products = data.products;
          this.totalPages = data.totalPages;
          console.log(this.totalPages);
          },
        error : (err)=>{ this.errorMessage = err;}
      });   // asynchronous programming
  }
    handleGetAllProduct(){  // method calling service by getALLProducts return an Observable object
      this.productService.getAllProducts() .subscribe(
        {
          next : (data) =>{ this.products = data;},
           error : (err)=>{ this.errorMessage = err;}
        });   // asynchronous programming
    }


  handleDeleteProduct(p: Product) {
    let conf = confirm("Are you sure to delete it?");
      if (conf == false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next : (data)=>{
       // this.handleGetAllProduct()
       let index = this.products.indexOf(p);
       this.products.splice(index, 1);
       }
    });

  }

 handleSetPromotion(p: Product) {
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next : (data)=>{
        p.promotion =!promo;
      },
      error : err =>{
        this.errorMessage = err;
        this.errorMessage = err;
      }
    })
  }
  handSearchProduct() {
    this.currentAction = "search";
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword, this.currentPage,this.pageSize).subscribe({
      next : (data)=>{this.products = data.products;
      this.totalPages = data.totalPages;
      }
    })
  }
  gotoPage(i: number) {
    this.currentPage = i;
    this.handleGetPageProduct();
  }

  handleAddProduct() {
  this.router.navigateByUrl("/admin/newProduct")
  }

  handleEditProduct(p: Product) {
    this.router.navigateByUrl("/admin/editProduct/:id"+p.id);
  }
}
